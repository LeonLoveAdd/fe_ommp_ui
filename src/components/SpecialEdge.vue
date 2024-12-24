<template>
  <div class="custom-node">
    <Handle :id="labelRef + '_' + Position.Left" type="target" :position="Position.Left" />
    <div>
      <span>qp:{{ form.qp }} type:{{ form.type }} bank:{{ form.bank }} trxtype:{{ form.trxtype }} </span>
    </div>
    <Handle :id="labelRef + '_' + Position.Right" type="source" :position="Position.Right" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose, onMounted, toRefs, reactive } from 'vue';
import { Position, Handle } from '@vue-flow/core';
import { settingValue } from '../components/vueflowJS'
import { useVueFlow } from "@vue-flow/core";
const { updateNodeData } = useVueFlow()
 
const props = defineProps({
  data: {
    type: Object,
  },
  isParent: Boolean
})
const { data } = toRefs(props.data)
const labelRef = ref(data.value.label)
const form = reactive({
  qp: "",
  type: "",
  bank: "",
  trxtype: "",
  target: "",
})
onMounted(() => {
  setData()
})

// 用于规则节点的赋值
const setData = () => {
  form.qp = settingValue.value.qp.find(e => e.value === data.value.qp)?.label
  form.type = data.value.type
  form.bank = data.value.bank
  form.trxtype = data.value.trxtype
  form.target = data.value.target
}

defineExpose({ setData, updateNodeData }) 
</script>
 
<style scoped>
</style>