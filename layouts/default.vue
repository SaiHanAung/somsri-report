<script setup lang="ts">
import Navbar from './nav.vue';

const { $toast }: any = useNuxtApp();
const { db, dbRef, getData, onValue, setData } = useFbCRUD();
const { c } = useCL();
const reportDb = dbRef(db, 'reports')

const pages = reactive({
    value: Array,
    pending: true
})

const { pending, data: datas } = await useLazyAsyncData('refreshPages', () => getData(reportDb).then((snapshot: any) => snapshot.val()))
const refresh = () => refreshNuxtData('refreshPages').then(() => {
    pages.value = datas
})

onValue(reportDb, (snapshot: any) => {
    pages.value = snapshot.val()
    pages.pending = false
})
const update = () => {
    setData(reportDb, pages.value)
    $toast.success('อัพเดทข้อมูลสำเร็จ')
}

provide('pages', { pages, refresh })
</script>

<template>
    <ClientOnly>
        <div class="h-screen p-3 flex gap-3">
            <Navbar @update="update" />
            <slot />
        </div>
    </ClientOnly>
</template>
