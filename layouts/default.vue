<script setup lang="ts">
import Navbar from './nav.vue';

const { $toast }: any = useNuxtApp();
const { db, dbRef, getData, setData } = useFbCRUD();
const { c } = useCL();
const reportDb = dbRef(db, 'reports')

const { pending, data: pages, refresh } = await useLazyAsyncData('pages', () => getData(reportDb).then((snapshot: any) => snapshot.val()))

const update = () => {
    setData(reportDb, pages.value)
    $toast.success('อัพเดทข้อมูลสำเร็จ')
}

provide('pages', { pages, refresh })

</script>
<template>
    <div class="h-screen p-3 flex gap-3">
        <Navbar :pending="pending" @update="update" />
        <slot />
    </div>
</template>
