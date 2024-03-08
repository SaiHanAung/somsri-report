<script setup lang="ts">
const { $toast }: any = useNuxtApp();
const { c } = useCL();
const route = useRoute();

const { pages }: any = inject('pages');
const isMobile: any = inject('isMobile');
const displayedPages: any = computed(() => pages.value)
const page: any = ref(null);
const error = reactive({ value: "" });
const updateFrame = () => {
    if (page.value?.title) {
        useHead({
            title: page.value.title || ""
        })

        if (page.value?.app_url && !page.value?.app_url?.includes('powerbi')) {
            $toast.error('ลิงค์มีปัญหา หรือลิงค์อาจไม่ถูกต้อง')
            clearError({ redirect: '/' })
        }
    } else {
        error.value = "ไม่พบหน้าที่คุณกำลังจะไป"
    }
}

try {
    pages?.value.find((val: Record<string, Object>) => {
        if (val?.page_url == route.path) {
            page.value = val
        }

    })
    updateFrame()
} catch (error) {
    console.error(error)
}

watch(displayedPages, (newVal: any) => {
    page.value = newVal.find((page: Record<string, Object>) => page?.page_url === route.path)
    updateFrame()
})

</script>

<template>
    <div v-if="error.value" class="grid content-center justify-center h-full">
        <p class="text-center text-[#a52241] font-bold text-3xl">{{ error.value }}</p>
    </div>
    <div v-else>
        <template v-if="page">
            <div v-if="!page.app_url" class="grid content-center justify-center h-full">
                <p class="text-center text-[#a52241] font-bold text-xl">ยังไม่มีลิงค์ Power bi</p>
            </div>
            <iframe v-else :class="['rounded-2xl h-full w-full', isMobile && 'relative top-12']"
                :src="page.app_url"></iframe>
        </template>
    </div>
</template>