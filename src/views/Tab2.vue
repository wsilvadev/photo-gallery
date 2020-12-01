<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Photo Gallery</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-grid>
                <ion-row>
                    <ion-col size="6" :key="photo" v-for="photo in photos">
                        <ion-img :src="photo.webViewPath"></ion-img>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-fab vertical="bottom" horizontal="center" slot="fixed">
                <ion-fab-button @click="takePhoto()">
                    <ion-icon :icon="camera"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { camera, trash, close } from 'ionicons/icons';
import { usePhotoGallery, Photo } from '../composables/usePhotoGallery';
import {
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
} from '@ionic/vue';

export default {
    name: 'Tab2',
    components: {
        IonPage,
        IonHeader,
        IonFab,
        IonFabButton,
        IonIcon,
        IonToolbar,
        IonTitle,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonImg
    },
    setup() {
        const { photos, takePhoto } = usePhotoGallery();
        return { photos, takePhoto, camera, trash, close };
    }
};
</script>
