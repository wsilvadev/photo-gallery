import { ref, onMounted, watch } from 'vue';
import { isPlatform } from '@ionic/vue';
import {
    Plugins,
    CameraResultType,
    CameraSource,
    CameraPhoto,
    FilesystemDirectory,
    Capacitor
} from '@capacitor/core';

export interface Photo {
    filepath: string;
    webViewPath?: string;
}

export function usePhotoGallery() {
    const { Camera, Filesystem, Storage } = Plugins;
    const photos = ref<Photo[]>([]);
    const PHOTO_STORAGE = 'photos';
    let base64Data: string;

    const cachePhotos = () => {
        Storage.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(photos.value)
        });
    };

    watch(photos, cachePhotos);
    const loadSaved = async () => {
        const photoList = await Storage.get({ key: PHOTO_STORAGE });
        const photosInStorage = photoList.value
            ? JSON.parse(photoList.value)
            : [];

        if (isPlatform('hybrid')) {
            for (const photo of photosInStorage) {
                const file = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: FilesystemDirectory.Data
                });
                photo.webViewPath = `data:image/jpeg;base64,${file.data}`;
            }
        }
        photos.value = photosInStorage;
    };
    onMounted(loadSaved);

    const convertBlobToBase64 = (blob: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });

    const savePicture = async (
        photo: CameraPhoto,
        fileName: string
    ): Promise<Photo> => {
        if (isPlatform('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path!
            });
            base64Data = file.data;
        }
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        base64Data = (await convertBlobToBase64(blob)) as string;

        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: FilesystemDirectory.Data
        });

        if (isPlatform('hybrid')) {
            return {
                filepath: savedFile.uri,
                webViewPath: Capacitor.convertFileSrc(savedFile.uri)
            };
        } else {
            return {
                filepath: fileName,
                webViewPath: photo.webPath
            };
        }
    };
    const takePhoto = async () => {
        const cameraPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });
        const fileName = new Date().getTime() + '.jpeg';
        const saveFileImage = await savePicture(cameraPhoto, fileName);
        photos.value = [saveFileImage, ...photos.value];
    };

    return {
        photos,
        takePhoto
    };
}
