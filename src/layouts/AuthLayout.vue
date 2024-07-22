<template>
    <div class="WAL position-relative bg-grey-4" :style="style">
      <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>            
        <q-page-container class="bg-grey-2">
            <q-page class="fixed-center q-mt-lg">
                    <SignIn/>               
            </q-page>
        </q-page-container>
    </q-layout>
    </div>
</template>

<script setup>
import { SignIn } from 'vue-clerk';
import { computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useAuth } from 'vue-clerk';
import { useRouter} from 'vue-router';


const { getToken, isLoaded, isSignedIn } = useAuth()
const $q = useQuasar()
const $router = useRouter()



async function fetchDataFromExternalResource() {
    const token = await getToken.value({ template: "hasura" })
    localStorage.setItem(
    "token",
    token
    );
    return data
}


const style = computed(() => ({
        height: $q.screen.height + 'px'
    }))

    watch(isSignedIn, (isSignedIn) => {
        if (!isSignedIn) {
            return;
        }
        fetchDataFromExternalResource();
    });
</script>