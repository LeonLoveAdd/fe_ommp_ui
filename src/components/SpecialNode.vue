<!-- CustomNode.vue -->
<template>
  <div class="custom-node">
    <NodeToolbar :is-visible="false">
      <el-row class="flex justify-space-between mb-4 flex-wrap gap-4">
        <el-button size="small" type="primary" round>delete</el-button>
        <el-button size="small" type="success" round>copy</el-button>
        <el-button size="small" type="info" round>expand</el-button>
      </el-row>
    </NodeToolbar>
    <Handle :id="labelRef + '_' + Position.Left" type="target" :position="Position.Left"></Handle>
    <div>
      <el-input input-style="border: none;width: 150px;height: 14px;color: #ccc;font-size: 12px;text-align: center;border-radius: 4px;" 
      v-model="lableTest"
      @change="updateId"
      @mousedown.stop="handleMouseDown"
      @click.stop="handleInputClick" />
    </div>
    <!-- <div style="position: relative;top: -20px;left: -80px;"></div> -->
    <div style="position: absolute;top: 3px;left: 20px;">
      <el-tooltip content="添加规则" placement="top-start">
        <el-button style="width: 14px;height: 14px;padding: 6px;" circle @click.stop="handleButtonAdd">
          <el-icon style="vertical-align: middle;margin: 0 auto;"><Plus /></el-icon>
          <!-- <Icon name="plus" icon="eq:plus" size="12" style="color: aquamarine;"></Icon> -->
        </el-button>
      </el-tooltip>
    </div>
    <div style="position: absolute;top: 3px;right: 20px;">
      <el-tooltip content="删除规则" placement="top-start">
        <el-button style="width: 14px;height: 14px;padding: 6px;" circle @click.stop="handleButtonDelete">
          <el-icon style="vertical-align: middle;margin: 0 auto;"><Minus /></el-icon>
          <!-- <Icon name="plus" icon="eq:plus" size="12" style="color: aquamarine;"></Icon> -->
        </el-button>
      </el-tooltip>
    </div>
    <Handle :id="labelRef + '_' + Position.Right" type="source" :position="Position.Right" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose, defineEmits, onMounted, toRefs } from 'vue';
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { settingValue } from '../components/vueflowJS'
import { Position, Handle } from "@vue-flow/core";
import Icon from './Icon.vue'
const emit = defineEmits(['addRules','deleteRules','updateRules'])
const props = defineProps({
  data: {
    type: Object
  },
});
// toRefs(param)---承接数据的变量名需要与param中的属性名一致
const { data } = toRefs(props.data);
// toRef(param,title)---承接数据的变量名不需要与param中的属性名一致，
// 可以自定义，title指向该变量需要承接的属性在param中的的名称
const labelRef = ref(data.value.label);
const lableTest = ref();
const oldValue = ref(); // input框的旧值
const { id } = toRefs(props.data);

onMounted(() => {
  lableTest.value = data.value.label
})
const addRules = (data) => {
  emit('addRules', data)
}
const deleteRules = (data) => {
  emit('deleteRules', data)
}
const updateRules = (data) => {
  emit('updateRules', data)
}
const updateId = (e) => {
  data.value.newValue = e;
  data.value.oldValue = oldValue.value;
  updateRules(data.value);
}
const handleMouseDown = (event) => {
  // this.isInputActive = true; // 标记input为活动状态
  // event.stopPropagation(); // 根据需要决定是否调用
}
const handleInputClick = (event) => {
  // console.log('input当前值',event.target.value)
  oldValue.value = event.target.value;
  // 处理input点击事件
  // event.stopPropagation(); // 阻止事件冒泡
};
const handleButtonAdd = (event) => {
  // 处理button点击事件
  // event.stopPropagation(); // 阻止事件冒泡
  addRules(data.value);
};
const handleButtonDelete = (event) => {
  // 处理button点击事件
  // event.stopPropagation(); // 阻止事件冒泡
  deleteRules(data.value);
};
const updateIdN = (e) => {
  id.value = e
}
defineExpose({ updateIdN }) 
</script>

<style scoped>
</style>