
<script>
import draggable from "vuedraggable";
import rawDisplayer from "@/components/raw-displayer.vue";

export default {
    components: {
        draggable
    },
    props: {
        list: Array
    },
    data() {
        return {
            list: this.list,
        };
    }
}
</script>
<template>
    <draggable :list="list" item-key="name" class="list-group" ghost-class="ghost">
        <template #item="{ element }">
            <div class="list-group-item">
                {{ element.name }}
            </div>
        </template>
    </draggable>
    <rawDisplayer :value="list" title="List" />
</template>
  
<style>
.buttons {
    margin-top: 35px;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.not-draggable {
    cursor: no-drop;
}
</style>