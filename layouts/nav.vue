<script setup lang="ts">
import EditPage from "~/components/editPage.vue";

const { c } = useCL();
const { $toast }: any = useNuxtApp();
const route = useRoute();
const Visiting = (name: string) => {
    if (route.params.page == name?.toLowerCase()) return true;
};

const isMobile: any = inject('isMobile');

const { pages, refresh }: any = inject('pages');
const emit = defineEmits(["update"]);

const router: any = useRouter();
const goToOtherPage = (page: Record<string, Object>) => router.push({
    path: page.page_url,
    state: {
        app_url: page.app_url,
        title: page.title
    }
});

type PageDetail = { [key: string]: string }[]

interface dataReactive {
    email?: string;
    password?: string;
    err?: string;
    isLoggedIn?: boolean;
    isAddPage?: boolean;
    pageName?: string;
    appUrl?: string;
    pageDetail?: PageDetail;
    reports?: PageDetail;
    modalId?: string;
    isEditPage?: string;
}

const data: dataReactive = reactive({});

const { db, dbRef, setData, auth, signIn, checkAuth, logOut } = useFbCRUD();
const reportDb = dbRef(db, 'reports')

checkAuth(auth, (user: any) => {
    data.isLoggedIn = user ? true : false
})

const login = (modalId: string) => {
    signIn(auth, data.email, data.password).then((userCredential: any) => {
        data.err = null
        document.getElementById(modalId).close();
        data.email = ""
        data.password = ""
    }).catch(() => {
        $toast.warning('อีเมลหรือรหัสผ่านผิด')
        data.err = "อีเมลหรือรหัสผ่านผิด"
    })
}

const updateData = () => {
    if (data.pageDetail) {
        for (const page1 in pages.value) {
            for (const page2 in data.pageDetail) {
                if (pages.value[page1].title == data.pageDetail[page2].name.toUpperCase()) {
                    $toast.error(`ชื่อซ้ำกันไม่ได้ ชื่อ ${data.pageDetail[page2].name} ถูกใช้แล้ว`)
                    return
                }

                if (!data.pageDetail[page2].name) {
                    $toast.warning('ชื่อหน้าที่เป็นค่าว่างจะไม่ถูกเพิ่มเข้าไป')
                    data.pageDetail.splice(page2, 1)
                }
            }
        }

        data.reports = pages.value
        for (const page of data.pageDetail) {
            data.reports.push({
                title: page.name.toUpperCase(),
                app_url: page.appUrl,
                page_url: `/${page.name.toLowerCase()}`,
                svgTag: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke - linecap="round" stroke - linejoin="round" d = "M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>`
            })
        }
        setData(reportDb, data.reports)
        data.pageDetail = undefined
        return
    }
    emit('update')
}
const signOut = () => logOut(auth)

const doAddPage = () => {
    data.isAddPage = true
    if (!data.pageDetail) data.pageDetail = []
    data.pageDetail.push({ name: "", appUrl: "" })
}

const moveIndex = (page: Record<string, Object>, index: number, status: number) => {
    const temp = pages.value[index];
    pages.value[index] = pages.value[index + status];
    pages.value[index + status] = temp;
}

</script>
<template>
    <span v-if="pages.pending" class="loading loading-spinner loading-lg text-[#a52241] absolute left-1/2 top-1/2"></span>
    <div :class="[isMobile ? 'hidden' : 'flex', 'bg-[#a52241] rounded-box max-w-fit h-full text-white flex flex-col']">
        <div class="py-2 sticky top-0 text-center border-b-2">
            <NuxtLink to="/" class="flex flex-col hover:bg-transparent focus:text-white">
                <img class="object-scale-down" src="https://new-backend.somsritshirt.com/image/logo-white.png"
                    alt="somsri-logo" />
                <p class="font-bold">REPORT</p>
            </NuxtLink>
        </div>
        <ul class="menu divide-y h-full overflow-y-auto overflow-x-hidden flex flex-nowrap">
            <li class="py-2 " v-for="(page, i) in pages.value" :key="'page_button_' + i">
                <NuxtLink @click="goToOtherPage(page)" :class="[
                    Visiting(page.title)
                        ? 'bg-white text-[#7f1d1d] hover:text-white'
                        : 'hover:bg-[#7f1d1d]',
                ]">
                    <div v-html="page.svgTag"></div>
                    <span>{{ page.title }}</span>
                </NuxtLink>
            </li>
        </ul>
        <div class="p-3 text-center border-t">
            <button class="btn btn-sm btn-ghost" onclick="edit_modal.showModal()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                ตั้งค่า
            </button>
        </div>
    </div>

    <div :class="[isMobile ? 'flex' : 'hidden', 'navbar bg-base-100 absolute top-0']">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </div>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li class="py-2 " v-for="(page, i) in pages.value" :key="'page_button_' + i">
                        <NuxtLink @click="goToOtherPage(page)" :class="[
                            Visiting(page.title)
                                ? 'bg-white text-[#7f1d1d] hover:text-white'
                                : 'hover:bg-[#7f1d1d]',
                        ]">
                            <div v-html="page.svgTag"></div>
                            <span>{{ page.title }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
        <div class="navbar-end">
            <NuxtLink to="/" class="flex flex-row-reverse pr-3 hover:bg-transparent focus:text-white text-center">
                <img class=" w-1/4 h-1/4" src="../public/favicon.ico" alt="somsri-logo" />
                <!-- <p class="font-bold">REPORT</p> -->
            </NuxtLink>
        </div>
    </div>

    <!-- MODAL -->
    <dialog id="edit_modal" class="modal text-[#a52241]">
        <div class="modal-box max-w-xl">
            <div class="flex justify-between sticky top-0">
                <div class="flex items-center gap-3">
                    <span class="font-bold text-lg">รายการลิงค์ Power bi</span>
                    <div class="tooltip tooltip-right" data-tip="เลือกดู Icon">
                        <nuxt-link to="https://heroicons.com/" class="btn btn-sm btn-circle btn-ghost" target="blank">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-5 h-5 ">
                                <path
                                    d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
                            </svg>
                        </nuxt-link>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button v-if="data.isLoggedIn"
                        class="btn btn-sm btn-circle btn-ghost flex text-center tooltip tooltip-left" @click="signOut"
                        data-tip="ออกจากระบบแก้ไข">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                    </button>
                    <button v-else class="btn btn-circle btn-ghost btn-sm" onclick="login_modal.showModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                    </button>
                    <button v-if="!data.isLoggedIn"
                        class="btn btn-sm btn-circle btn-ghost flex text-center tooltip tooltip-left"
                        onclick="edit_modal.close()" data-tip="ปิดหน้าต่างนี้">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="overflow-y-auto overflow-x-hidden" style="height: 32rem;">
                <div :class="['pt-4 flex gap-3 items-center', data.isEditPage != page.page_url ? '' : 'border-2 rounded-xl pb-4 pl-4 mt-3']"
                    v-for="(page, i) in pages.value" :key="'page_edit_' + i">
                    <div v-if="data.isEditPage == page.page_url" class="grid gap-2 w-full">
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
                    <div v-else class="join w-full">
                        <span class="btn btn-sm join-item rounded-r-full cursor-default">{{
                            page.title
                        }}</span>
                        <input class="btn btn-sm input text-left cursor-text input-bordered join-item w-full text-black"
                            :placeholder="!page.app_url ? 'ช่องกรอกลิงค์ Power bi' : page.app_url
                                    " v-model="page.app_url" :disabled="!data.isLoggedIn" />
                    </div>
                    <button class="btn btn-sm btn-circle btn-ghost"
                        v-if="data.isLoggedIn && data.isEditPage != page.page_url" @click="data.isEditPage = page.page_url">
                        <!-- Edit icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                    </button>
                    <div v-if="data.isEditPage == page.page_url" class="grid content-center">
                        <button class="btn btn-sm btn-circle btn-ghost" @click="moveIndex(page, i, -1)" v-if="i != 0">
                            <!-- Arrow up icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                                <path fill-rule="evenodd"
                                    d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-circle btn-ghost">
                            <!-- Delete icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" @click="pages.value.splice(i, 1)"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-circle btn-ghost" @click="moveIndex(page, i, 1)"
                            v-if="i != pages.value.length - 1">
                            <!-- Arrow down icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                                <path fill-rule="evenodd"
                                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- ADD PAGE -->
                <div class="p-3 mt-4 border-2 border-gray rounded-xl" v-if="data.isAddPage && data.pageDetail">
                    <div class="grid py-2" v-for="(page, i) in data.pageDetail" :key="'add_page_' + i">
                        <div class="flex items-center gap-2">
                            <div>
                                <div class="join w-full mb-2">
                                    <span class="btn btn-sm join-item rounded-r-full cursor-default">ชื่อหน้า</span>
                                    <input
                                        class="btn btn-sm input text-left cursor-text input-bordered join-item w-full text-black"
                                        v-model="page.name" />
                                </div>
                                <div class="join w-full">
                                    <span class="btn btn-sm join-item rounded-r-full cursor-default">ลิงค์ Power
                                        bi</span>
                                    <input
                                        class="btn btn-sm input text-left cursor-text input-bordered join-item w-full text-black"
                                        v-model="page.appUrl" />
                                </div>
                            </div>
                            <button class="btn btn-sm btn-circle btn-ghost" @click="data.pageDetail?.splice(i, 1)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="grid mt-4" v-if="data.isLoggedIn">
                    <button @click="doAddPage"
                        class="btn btn-sm btn-outline btn-ghost border-[#a52241] text-[#a52241] hover:bg-[#a52241] hover:border-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        เพิ่มหน้า
                    </button>
                </div>
                <!--  -->
            </div>
            <form method="dialog" class="grid grid-cols-2 gap-4 mt-4 sticky bottom-0" v-if="data.isLoggedIn">
                <button class="btn btn-sm text-[#a52241]"
                    @click="refresh(); data.pageDetail = undefined; data.isEditPage = undefined"
                    onclick="edit_modal.close()">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    ยกเลิกการเปลี่ยนแปลง
                </button>
                <button @click="updateData(); data.isEditPage = undefined" onclick="edit_modal.close()"
                    class="btn btn-sm bg-[#a52241] text-white hover:bg-[#831b33] hover:border-[#a52241]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                    </svg>
                    บันทึกการเปลี่ยนแปลง
                </button>
            </form>
        </div>
    </dialog>
    <dialog id="login_modal" class="modal text-[#a52241]">
        <div class="modal-box">
            <div class="flex justify-between">
                <span class="font-bold text-lg">Login เพื่อแก้ไขลิงค์</span>
            </div>
            <form @submit.prevent="login('login_modal')">
                <div class="pt-4">
                    <div class="join w-full">
                        <span class="btn btn-sm join-item rounded-r-full cursor-default">Email</span>
                        <input class="btn btn-sm input text-left cursor-text input-bordered join-item w-full text-black"
                            placeholder="ช่องกรอก Email" v-model="data.email" required />
                    </div>
                </div>
                <div class="pt-4">
                    <div class="join w-full">
                        <span class="btn btn-sm join-item rounded-r-full cursor-default">Password</span>
                        <input type="password"
                            class="btn btn-sm input input-bordered cursor-text join-item w-full text-left text-black"
                            placeholder="ช่องกรอก Password" v-model="data.password" required />
                    </div>
                </div>
                <div v-if="data.err" class="pt-4 text-center">{{ data.err }}</div>
                <div class="grid mt-4">
                    <div
                        class="btn btn-sm bg-[#a52241] text-white hover:text-[#a52241] hover:bg-white hover:border-[#a52241]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                        <input type="submit" value="Login">
                    </div>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
<style>
/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #a52241;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #8d1732;
}
</style>