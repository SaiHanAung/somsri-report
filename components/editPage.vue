<script setup lang="ts">
const { page }: any = useAttrs();
</script>
<template>
    <div class="grid gap-2 w-full">
        <div class="join">
            <span class="btn btn-sm join-item rounded-r-full cursor-default">ชื่อ</span>
            <input class="btn btn-sm input text-left cursor-text input-bordered join-item w-full text-black"
                v-model="page.title" />
        </div>
        <div class="join">
            <span class="btn btn-sm join-item rounded-r-full cursor-default">ลิงค์ Power BI</span>
            <input class="btn btn-sm input text-left cursor-text input-bordered join-item w-full text-black"
                v-model="page.app_url" />
        </div>
        <div class="join">
            <span class="btn btn-sm join-item rounded-r-full cursor-default">SVG Icon</span>
            <input class="btn btn-sm input text-left cursor-text input-bordered join-item w-full text-black"
                v-model="page.svgTag" />
        </div>
    </div>
</template>
