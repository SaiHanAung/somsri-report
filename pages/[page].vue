<script setup lang="ts">
const { $toast }: any = useNuxtApp();
const { c } = useCL();
const route = useRoute();

const { pages }: any = inject('pages');

const page = pages.value.filter((page: Record<string, Object>) => page?.page_url == route.path)[0]
const error = reactive({ value: "" });

if (page?.title) {
    useHead({
        title: page.title || ""
    })

    if (page.app_url) {
        try {
            const response = await fetch(page.app_url); // ถ้าเป็นลิงค์ของ power bi จะไม่สามารถ fetch ข้อมูลได้
            if (response) {
                $toast.error('ลิงค์มีปัญหา หรือลิงค์อาจไม่ถูกต้อง')
                clearError({ redirect: '/' })
            }
        } catch (error) {
            // console.error('เกิดข้อผิดพลาดในการตรวจสอบลิงค์:', error);
        }
    }
} else {
    error.value = "ไม่พบหน้าที่คุณกำลังจะไป"
}
</script>
<template>
    <div v-if="error.value" class="grid content-center justify-center h-full">
        <p class="text-center text-[#a52241] font-bold text-3xl">{{ error.value }}</p>
    </div>
    <div v-else>
        <div v-if="!page.app_url" class="grid content-center justify-center h-full">
            <p class="text-center text-[#a52241] font-bold text-xl">ยังไม่มีลิงค์ Power bi</p>
        </div>
        <iframe v-else class="rounded-2xl h-full w-full" :src="page.app_url"></iframe>
    </div>
</template>