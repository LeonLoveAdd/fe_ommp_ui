<template>
  <div class="vue-flow-container">
    <el-row class="row-bg" style="border-bottom: 1px solid #ccc;margin-bottom: 15px;" justify="space-between">
      <el-col :span="4">
        <el-form ref="form1" :rules="rules" :model="formSearch" label-width="120px">
          <el-form-item label="请求响应标识" prop="qp">
            <!-- <el-input :prefix-icon="Search" size="small" v-model="formSearch.qp" /> -->
            <el-select
              v-model="formSearch.qp"
              class="m-2"
              placeholder="Select"
              size="small"
            >
              <el-option
                v-for="item in settingValue.qp"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disable"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-form ref="form2" :rules="rules" :model="formSearch" label-width="120px">
          <el-form-item label="交易类型标识" prop="type">
            <!-- <el-input :prefix-icon="Search" size="small" v-model="formSearch.type" /> -->
            <el-select
              v-model="formSearch.type"
              class="m-2"
              placeholder="Select"
              size="small"
            >
              <el-option
                v-for="item in settingValue.type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disable"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-form ref="form3" :rules="rules" :model="formSearch" label-width="120px">
          <el-form-item label="银行编码" prop="bank">
            <!-- <el-input :prefix-icon="Search" size="small" v-model="formSearch.bank" /> -->
            <el-input size="small" v-model="formSearch.bank" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-form ref="form4" :rules="rules" :model="formSearch" label-width="120px">
          <el-form-item label="交易类行码" prop="trxtype">
            <!-- <el-input :prefix-icon="Search" size="small" v-model="formSearch.trxtype" /> -->
            <el-input size="small" v-model="formSearch.trxtype" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-form ref="form5" :rules="rules" :model="formSearch" label-width="120px">
          <el-form-item label="所在模块" prop="inputModule">
            <el-select
              v-model="formSearch.inputModule"
              class="m-2"
              placeholder="Select"
              size="small"
            >
              <el-option
                v-for="item in settingValue.target"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="center-content">
        <div style="margin-bottom: 15px;">
          <el-button class="el-button el-button--primary is-plain" 
                size="small" type="info" round @click="searchNodes" :icon="Search">搜索</el-button>
          <el-switch style="margin-left: 30px;" v-model="visiable" @change="nodeVisiable" active-text="搜索时隐藏无关节点" inactive-text="搜索时不隐藏无关节点" />
          <el-button style="margin-left: 30px;" class="el-button el-button--primary is-plain" 
                size="small" type="info" round @click="resetForm" :icon="Refresh">重置搜索框</el-button>
        </div>
      </el-col>
      <!-- <el-button class="el-button el-button--primary is-plain" 
        size="small" type="info" round @click="exportConfig">下载</el-button> -->
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form label-width="100px">
          <el-form-item>
            <div class="grid-content ep-bg-purple-light" justify="end">
              <el-button class="el-button el-button--primary is-plain" 
                size="small" type="primary" @click="dragModule('bankcomm')" :icon="Plus">添加通讯模块</el-button>
              <el-button class="el-button el-button--primary is-plain" 
                size="small" type="primary" @click="dragModule('')" :icon="Plus">添加普通模块</el-button>
              <el-button class="el-button el-button--primary is-plain" 
                size="small" type="primary" @click="addNode('b')" :icon="Plus">添加自定义模块</el-button>
              <el-button :disabled="parentSetting.length <= 0" class="el-button el-button--primary is-plain" 
                size="small" @click="deleteModules()" :icon="Minus">删除模块</el-button>
              <el-button class="el-button el-button--primary is-plain" 
                size="small" type="info" @click="saveSetting()" :icon="Finished">保存配置</el-button>
              <el-button class="el-button el-button--primary is-plain" 
                size="small" type="info" @click="releaseSetting()" :icon="Finished">发布</el-button>
              <el-button class="el-button el-button--primary is-plain" 
                size="small" type="info" @click="resetViews" :icon="Refresh">重置视图</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
      <!-- @node-double-click="exportConfig" 
      @node-drag-start="onNodeDragStart"
      :node-types="{ customNode: CustomNode, module: CustomModuleNode }"
      @node-drag-stop="onNodeDragStop"
      @nodes-initialized="layoutGraph('TB')" -->
    <VueFlow :nodes="nodes" :edges="edges" 
      @node-drag-stop="onNodeDragStop"
      @connect-start="onConnectStart"
      @connect="onConnect"
      @connect-end="onConnectEnd"
      @node-double-click="onNodeClick" 
      @node-click="onNodeSClick" 
      @edge-click="onEdgeClick"
      :delete-key-code="false"
      :default-viewport="{ zoom: 0.8 }"
      :min-zoom="0.2"
      :max-zoom="4"
      :node-types="{ customNode: CustomNode, module: CustomModuleNode }"
      style="height: 95vh; width: 90vw">
      <Controls position="top-left">
        <!-- <ControlButton title="Reset Transform" @click="resetTransform">
          <Icon name="reset" />
        </ControlButton>

        <ControlButton title="Shuffle Node Positions" @click="updatePos">
          <Icon name="update" />
        </ControlButton>

        <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
          <Icon v-if="dark" name="sun" />
          <Icon v-else name="moon" />
        </ControlButton>

        <ControlButton title="Log `toObject`" @click="logToObject">
          <Icon name="log" />
        </ControlButton> -->
      </Controls>
      <Background pattern-color="#aaa" :gap="16" />
      <MiniMap pannable zoomable />
      <template #node-module="props">
        <CustomModuleNode ref="CustomModuleNodeRef" :data="props" @addRules="addRules" @deleteRules="deleteRules" @updateRules="updateRules"></CustomModuleNode>
      </template>
      <template #node-customNode="props">
        <CustomNode ref="CustomNodeRef" :data="props"></CustomNode>
      </template>
    </VueFlow>

    <el-dialog v-model="dialogFormVisible" title="规则属性修改" width="500">
      <el-form :model="form">
        <el-form-item label="请求响应标识" :label-width="formLabelWidth">
          <el-select size="small" v-model="form.qp" placeholder="请求响应标识">
            <el-option
              v-for="item in settingValue.qp"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="交易类型标识" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="交易类型标识">
            <el-option
              v-for="item in settingValue.type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="银行编码" :label-width="formLabelWidth">
          <el-input v-model="form.bank" autocomplete="off" placeholder="银行编码" />
        </el-form-item>
        <el-form-item size="small" label="交易类行码" :label-width="formLabelWidth">
          <el-input v-model="form.trxtype" autocomplete="off" placeholder="交易类行码" />
        </el-form-item>
        <el-form-item size="small" label="目标模块" :label-width="formLabelWidth">
          <el-select v-model="form.target" @change="updataTarget" placeholder="目的模块">
            <el-option
              v-for="item in settingValue.target"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogFormClose">取消</el-button>
          <el-button size="small" type="primary" @click="confirmOption">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogModulesVisible" title="模块属性修改" width="500">
      <el-form :model="moduleForm">
        <el-form-item label="topic" :label-width="formLabelWidth">
          <el-input v-model="moduleForm.topic" autocomplete="off" placeholder="请输入topic" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogModulesClose">取消</el-button>
          <el-button size="small" type="primary" @click="confirmModules">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogFormComparison" title="对比" width="600">
      <el-form :model="form" label-position="top">
        <el-row>
          <el-col :span="12">
            <el-form-item label="上一版本" :label-width="formLabelWidth">
              <div class="formatted-json" v-html="comparsion.oldVision"></div>
              <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 1000 }" resize="none" v-model="comparsion.oldVision" autocomplete="off" disabled /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="此次版本" :label-width="formLabelWidth">
              <div class="formatted-json" v-html="diffContent"></div>
              <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 1000 }" resize="none" v-model="comparsion.newVision" autocomplete="off" disabled /> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="releaseCancel()">Cancel</el-button>
          <el-button size="small" type="primary" @click="releaseSettingComfirm">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { nodes, edges, usualSmallStyle, usualBigStyle, settingValue, transformData, saveConfig, obj, positionInit, bankcommPositionInit } from './components/vueflowJS'
import { reactive, ref, onMounted, nextTick } from "vue";
import { VueFlow, useVueFlow, MarkerType } from "@vue-flow/core";
import { Background } from '@vue-flow/background';
import { ControlButton, Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { diffWords } from 'diff';
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Minus, Finished, Refresh } from '@element-plus/icons-vue'
import Icon from './components/Icon.vue'
import ELK from 'elkjs/lib/elk.bundled.js';
import jsYaml from 'js-yaml';
import CustomModuleNode from './components/SpecialNode.vue'; 
import CustomNode from './components/SpecialEdge.vue';
const { updateNodeData, applyEdgeChanges, fitView } = useVueFlow()
const heightB = ref()  //用于计算父节点动态高度
const formLabelWidth = ref(100);
const smallNodeIndex = ref(1);  //规则数量
const bigNodeIndex = ref(1); //模块数量
const dialogFormVisible = ref(false);
const dialogModulesVisible = ref(false);
const dialogFormComparison = ref(false);
const childSetting = ref(); //选中的规则
const childrenSetting = ref([]); //选中规则的暂存
const parSetting = ref(); //选中的模块
const parentSetting = ref([]); //选中模块的暂存
const parentNode = ref(null);
const CustomNodeRef = ref(null);
const CustomModuleNodeRef = ref(null);
const visiable = ref(false);
const diffContent = ref('');
const form1 = ref();
const form2 = ref();
const form3 = ref();
const form4 = ref();
const form5 = ref();
const nodesSave = ref();
const edgesSave = ref();
const finalObj = ref({});
const targetValue = ref({  //存放target中变更前后的值
  oldValue: '',
  newValue: ''
})
const form = reactive({
  qp: "",
  type: "",
  bank: "",
  trxtype: "",
  target: "",
})
const formSearch = reactive({
  qp: "",
  type: "",
  bank: "",
  trxtype: "",
  inputModule: "",
})
const rules = reactive({
  qp: [
    { required: true, message: '请选择qp', trigger: 'change' },
  ],
  type: [
    { required: true, message: '请选择type', trigger: 'change' },
  ],
  trxtype: [
    { required: true, message: '请输入trxtype', trigger: 'change' },
  ],
  inputModule: [
    { required: true, message: '请选择inputModule', trigger: 'change' },
  ],
  bank: [
    { len: 4, message: '请输入4位bank码', trigger: 'change' },
  ],
})
const comparsion = ref({
    oldVision: {},
    newVision: {}
})
const moduleForm = reactive({
  topic: ''
})

const handleDeleteKey = (event) => {
  const activeElement = document.activeElement;
  const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;
  if (event.key === 'Delete') {
    if(parentSetting.value.length > 0){
      deleteModules();
    } else if(childrenSetting.value.length > 0){
      ElMessage({
        type: 'error',
        message: '目前仅支持模块节点的快捷键删除!',
      });
    }
  }
  if (!isInput && ( event.key === 'Backspace' || event.keyCode === 8)){
    console.log('backspace')
    event.preventDefault(); // 阻止默认行为
  }
};

// 关闭模块配置框
const dialogModulesClose = () => {
  moduleForm.topic = '';
  parentNode.value = null;
  dialogModulesVisible.value = false;
}

// 确认模块配置
const confirmModules = () => {
  let node = nodes.value.find(item => item.id === parentNode.value.id);
  if(node){
    node.topic = moduleForm.topic;
  }
  moduleForm.topic = '';
  parentNode.value = null;
  dialogModulesVisible.value = false;
}

// 双击选中节点
const onNodeClick = (event) => {
  // 双击子节点可打开该子节点的配置框，更改其中配置
  if(event.node.isChild){
    // 双击选中该子节点
    form.qp = event.node.data.qp;
    form.type = event.node.data.type;
    form.bank = event.node.data.bank;
    form.trxtype = event.node.data.trxtype;
    form.target = event.node.data.target;
    childSetting.value = event.node;
    targetValue.value.oldValue = form.target
    dialogFormVisible.value = !dialogFormVisible.value
  } else {
    parentNode.value = nodes.value.find(item => item.id === event.node.id);
    moduleForm.topic = parentNode.value.topic;
    dialogModulesVisible.value = !dialogModulesVisible.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleDeleteKey, true);
  nextTick(() => {
    // 保存初始数据
    nodesSave.value = JSON.parse(JSON.stringify(nodes.value));
    edgesSave.value = JSON.parse(JSON.stringify(edges.value));
  });
  //这里调用接口获取上次保存到库里的值
  transformData(obj.data);
  if(nodes.value.length > 0){
    nodes.value.filter(item => { return item.isParent === true })?.map(e => {
      // 不推荐在map中直接处理改变外部数据的逻辑，后续修改
      settingValue.value.target.push({ label: e.id, value: e.id })
    })
  }
  reformPosition(nodes.value);
})

// 计算模块节点的位置(页面初始化时调用)
const reformPosition = (nodes) => {
  let bankcomm = [];
  let bridge = [];
  let fixIso = [];
  let cupdcomm = [];
  nodes.forEach((item, index) => {
    if(item.isParent){
      if (item.id.indexOf('bankcomm') > -1){
          bankcomm.push(item);
      } else if (item.id.indexOf('bridge') > -1){
          bridge.push(item);
      } else if (item.id.indexOf('cupdcomm') === -1){
          cupdcomm.push(item);
      } else {
          fixIso.push(item);
      }
    }
  });
  bridge.forEach((node, index) => {
      let posi = positionInit(index, node.id);
      node.position = { x: posi.x, y: posi.y };
  });
  bankcomm.forEach((node, index) => {
      let obj = positionInit(index, node.id);
      node.position = { x: obj.x, y: obj.y };
  });
  fixIso.forEach((node, index) => {
      let obj = positionInit(index, node.id);
      node.position = { x: obj.x, y: obj.y };
  });
  cupdcomm.forEach((node, index) => {
      let obj = positionInit(index, node.id);
      node.position = { x: obj.x, y: obj.y };
  });
}

// 添加节点时的位置计算
const getPosition = (index, value) => {
  let bankcomm = [];
  let bridge = [];
  let fixIso = [];
  let cupdcomm = [];
  let arr = nodes.value.filter(item => item.isParent);
  nodes.value.forEach((item, index) => {
    if(item.isParent){
      if (item.id.indexOf('bankcomm') > -1){
          bankcomm.push(item);
      } else if (item.id.indexOf('bridge') > -1){
          bridge.push(item);
      } else if (item.id.indexOf('cupdcomm') > -1){
          cupdcomm.push(item);
      } else {
          fixIso.push(item);
      }
    }
  });
  // 根据节点的类型和当前节点的数量，计算节点的位置(已有节点)
  if(arr.length > index){
    const targetObject = nodes.value[index];
    const array1Index = bankcomm.indexOf(targetObject);
    const array2Index = bridge.indexOf(targetObject);
    const array3Index = fixIso.indexOf(targetObject);
    const array4Index = cupdcomm.indexOf(targetObject);
    if (array1Index !== -1) {
      // 如果对象在 bankcomm 数组中，返回 positionInit 函数计算的位置
      return positionInit(array1Index, targetObject.id);
    } else if (array2Index !== -1) {
      // 如果对象在 bridge 数组中，返回 positionInit 函数计算的位置
      return positionInit(array2Index, targetObject.id);
    } else if (array3Index !== -1) {
      // 如果对象在 fixIso 数组中，返回 positionInit 函数计算的位置
      return positionInit(array3Index, targetObject.id);
    } else if (array4Index !== -1) {
      // 如果对象在 cupdcomm 数组中，返回 positionInit 函数计算的位置
      return positionInit(array4Index, targetObject.id);
    }
  } else {
    // 新增节点时的位置计算
    if(value.indexOf('bankcomm') > -1){
      return positionInit(bankcomm.length, value);
    } else if(value.indexOf('bridge') > -1){
      return positionInit(bridge.length, value);
    } else if(value.indexOf('cupdcomm') > -1){
      return positionInit(cupdcomm.length, value);
    } else {
      return positionInit(fixIso.length, value);
    }
  }
}

// 格式化节点数据
const formConfig = (nodes) => {
  let obj = {};
  obj.modules = {};
  let names = [];
  nodes.forEach(item => {
      if (item.isParent) {
          names.push(item.id);
      }
  });
  names.forEach(item => {
    let arr = []
    nodes.forEach(e => {
      if (e.parentNode === item) {
        arr.push({
          qp: e.data.qp,
          type: e.data.type,
          trxtype: e.data.trxtype,
          bank: e.data.bank,
          routeType: "I",
          target: e.data.target,
        })
      }
      obj.modules[item] = arr
    })
  })
  return obj;
}

// 检测闭环
const detectCycles = (nodes, edges) => {
  const visited = new Set();
  const recStack = new Set();
  const cycles = [];

  // 深度优先搜索，检查当前节点的所有出边，并递归的访问目标节点
  const dfs = (node, path, startModuleId, qpType) => {
    visited.add(node.id); // 已访问节点
    recStack.add(node.id); // 跟踪递归栈
    path.push(node.id); // 存储所有闭环路径

    edges.forEach(edge => {
      if (edge.source === node.id && (qpType === null || edge.qp === qpType || edge.qp === 9 || qpType === 9)) {
        // 获取所有出边的下一个节点
        const targetNode = nodes.find(n => n.id === edge.target);
        // 若存在目标节点，则递归访问
        if (targetNode) {
          if (targetNode.id === startModuleId) {
            // 若目标节点是起始规则节点所在的模块节点，则说明存在闭环，将当前路径存入 cycles
            cycles.push([...path, targetNode.id]);
          } else if (!visited.has(targetNode.id)) {
            // 若目标节点未访问过，则递归访问
            if (targetNode.isParent) {
              // 如果目标节点是模块节点，则递归其子节点
              nodes.forEach(childNode => {
                if (childNode.parentNode === targetNode.id) {
                  dfs(childNode, path, startModuleId, qpType);
                }
              });
            } else {
              dfs(targetNode, path, startModuleId, qpType);
            }
          }
        }
      }
    });

    path.pop(); // 递归结束后，将当前节点从路径中移除
    recStack.delete(node.id); // 从递归栈中移除当前节点
  };
  nodes.forEach(node => {
    if (!visited.has(node.id) && !node.isParent) {
      // 只对规则节点进行 DFS
      const startModuleId = node.parentNode;
      dfs(node, [], startModuleId, node.data.qp);
    }
  });
  return new Set(cycles.map(cycle => Array.from(cycle).join(' -> ')));
}

// 保存配置
const saveSetting = () => {
  let save = detectCycles(nodes.value, edges.value);
  console.log(save);
  if(save.size > 0){
    let Arr = Array.from(save)
    ElMessageBox.confirm('存在闭环：' + JSON.stringify(Arr) + '\n', '提示', {
      confirmButtonText: '确定',
      showCancelButton: false,
      // cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {});
    // ElMessage({
    //   type: 'error',
    //   message: '存在闭环，请检查!',
    // });
    return
  }
  // 保存配置
  saveConfig(formConfig(nodes.value));
}

// 发布配置之前对比
const releaseSetting = () => {
  finalObj.value = formConfig(nodes.value);
  comparsion.value.oldVision = JSON.stringify(formConfig(nodesSave.value), null, 2);
  comparsion.value.newVision = JSON.stringify(finalObj.value, null, 2);
  diffContent.value = highlightDifferences(comparsion.value.oldVision, comparsion.value.newVision);
  dialogFormComparison.value = !dialogFormComparison.value;
}

// 对比两个字符串，高亮显示不同之处
const highlightDifferences = (contentA, contentB) => {
  const differences = diffWords(contentA, contentB);
  let highlightedContent = '';

  differences.forEach((part) => {
    // 根据 diff 的类型，使用不同的颜色显示(added: 新增, removed: 删除)
    if (part.added) {
      highlightedContent += `<span style="color: red;">${part.value}</span>`;
    } else {
      highlightedContent += part.value;
    }
  });

  return highlightedContent;
}

// 发布窗口确认按钮
const releaseSettingComfirm = () => {
  // 保存配置
  saveConfig(finalObj.value)
  ElMessage({
    type: 'success',
    message: '发布成功!',
  });
  dialogFormComparison.value = !dialogFormComparison.value;
}

// 发布窗口取消按钮
const releaseCancel = () => {
  dialogFormComparison.value = !dialogFormComparison.value;
}

// 搜索时是否隐藏无关节点
const nodeVisiable = (e) => {
  visiable.value = e;
  if(formSearch.qp && formSearch.type && formSearch.trxtype && formSearch.inputModule){
    searchNodes();
  }
}

// 重置搜索框
const resetForm = () => {
  form1.value.resetFields()
  form2.value.resetFields()
  form3.value.resetFields()
  form4.value.resetFields()
  form5.value.resetFields()
}

// 重置视图 
const resetViews = () => {
  nodesSave.value.forEach(item => {
    item.style.border = '1px solid #bbb'
  })
  edgesSave.value.forEach(item => {
    item.style.stroke = '#ccc';
    item.style.strokeWidth = 1;
  })
  nodes.value = nodesSave.value;
  edges.value = edgesSave.value;
}

// 匹配搜索条件
const matchesSearchCriteria = (node, formSearch) => {
  // 根据实际的搜索条件进行匹配
  if(!node){
    ElMessage({
      type: 'info',
      message: '无对应规则路由',
    });
    return
  }
  if(formSearch.bank === '0000'){
    return (
      (node.data.qp === formSearch.qp || node.data.qp === 9) &&
      (node.data.type === formSearch.type || node.data.type === 'all') &&
      node.data.trxtype === formSearch.trxtype
    );
  } else {
    return (
      (node.data.qp === formSearch.qp || node.data.qp === 9) &&
      (node.data.type === formSearch.type || node.data.type === 'all') &&
      node.data.bank === formSearch.bank &&
      node.data.trxtype === formSearch.trxtype
    );
  }
}

// 获取父节点id
const getParentIdByChildId = (setData) => {
  const setArray = Array.from(setData);
  let modules = [];
  if(setArray.length > 0){
    setArray.forEach(item => {
      nodesSave.value.filter(e => {
        if(e.id === item){
          modules.push(e.parentNode)
        }
      })
    })
  }
  return new Set(modules)
}

// 设置高亮
const highlighted = (highlightedNodes) => {
  if(visiable.value){
    // 根据搜索条件高亮显示相关节点，非相关节点隐藏
    nodes.value = nodes.value.filter(item => {
      let temp = getParentIdByChildId(highlightedNodes)
      return (temp.has(item.id) || highlightedNodes.has(item.id))
    })
    nodes.value?.forEach(item => {
      // 筛选到的节点高亮设置
      if(item.isChild){
        item.style.border = '3px solid #FFC0CB';
      }
    });
    // 根据搜索条件高亮显示相关边，非相关边隐藏
    edges.value = edges.value.filter(item => highlightedNodes.has(item.id))
    edges.value?.forEach(item => {
      item.style.stroke = '#FFC0CB';
      item.style.strokeWidth = 3;
    })
  } else {
    // 高亮显示相关节点和边且不隐藏非相关节点和边
    nodes.value.filter(item => {
      if(item.isChild && highlightedNodes.has(item.id)){
        item.style.border = '3px solid #FFC0CB'
      }
    })
    edges.value.filter(item => highlightedNodes.has(item.id)).forEach(item => {
      item.style.stroke = '#FFC0CB';
      item.style.strokeWidth = 3;
    })
  }
}

// 高亮所有符合条件的点和边
const highlightNodesAndEdges = (node, nodes, edges, formSearch, highlightedNodes) => {
  // 遍历所有节点，找到符合搜索条件的节点
  if (matchesSearchCriteria(node, formSearch) && !highlightedNodes.has(node.id)) {
    highlightedNodes.add(node.id);
    // 高亮当前节点
    // 找到从当前节点出发的所有边
    edges.forEach(edge => {
      if (edge.source === node.id) {
        // 高亮边
        highlightedNodes.add(edge.id);
        const targetNode = nodes.filter(n => n.parentNode === edge.target)
              .find(node => matchesSearchCriteria(node, formSearch));
        if (targetNode) {
          // 递归高亮目标节点
          highlightNodesAndEdges(targetNode, nodes, edges, formSearch, highlightedNodes);
        }
      }
    });
  }
  // 设置高亮
  highlighted(highlightedNodes)
}

// 搜索功能
const searchNodes = () => {
  Promise.all([
    form1.value.validate(),
    form2.value.validate(),
    form3.value.validate(),
    form4.value.validate(),
    form5.value.validate(),
  ]).then(() => {
    nodes.value = nodesSave.value;
    edges.value = edgesSave.value;
    // 如果所有表单都验证成功，执行后续逻辑
    formSearch.bank = formSearch.bank ? formSearch.bank : '0000';
    // 找到起点模块中符合搜索条件的规则节点
    const startNodes = nodes.value.filter(node => node.parentNode === formSearch.inputModule)
    .find(node => matchesSearchCriteria(node, formSearch));
    // 创建一个 Set 来存储高亮的节点 ID
    const highlightedNodes = new Set();
    // 高亮符合条件的第一个规则节点
    highlightNodesAndEdges(startNodes, nodes.value, edges.value, formSearch, highlightedNodes)
  }).catch((error) => {
    console.log(error)
    // 如果任何一个表单验证失败，执行失败逻辑
    ElMessage({
      type: 'error',
      message: '请按规则填写!',
    });
  });
}

// 更新指定节点最新信息
const updateNewInfo = (id) => {
  nodes.value = nodes.value.map(node => {
    if (node.id === id) {
      return { ...node, key: Date.now() };
    }
    return node;
  });
}

// 添加规则
const addRules = (data) => {
  addNode('s',data)
}

// 删除规则
const deleteRules = (data) => {
  // 删除节点要将其对应的连线全部删除
  if(childrenSetting.value.length <= 0){
    return;
  }
  ElMessageBox.confirm('此操作将删除该规则, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // *************删除涉及到的边************
    edges.value = edges.value.filter(item => { 
      // childrenSetting.value中存放了所有需要删除的规则节点
      // some 方法来检查 childrenSetting 中是否存在至少一个对象，其 id 属性与 edges 中当前元素的 source或target 属性相匹配。
      return !childrenSetting.value.some(obj => {return (obj.id === item.source || obj.id === item.target)}) 
    })

    // *************删除规则************
    nodes.value = nodes.value.filter(item => { 
      // childrenSetting.value中存放了所有需要删除的规则
      // some 方法来检查 childrenSetting 中是否存在至少一个对象，其 id 属性与 nodes 中当前元素的 id 属性相匹配。
      return !childrenSetting.value.some(obj => obj.id === item.id) 
    })

    // *************更新模块节点data中的children数组
    nodes.value.filter(item => { 
      if(item.id === data.label){
        item.data.children = removeElementsFromArrayA(data.children, childrenSetting.value);
        // 数组更新完成后重新校准规则节点的显示位置
        nodes.value.filter(i => {
          if(i.isChild){
            item.data.children.forEach((e, index) => {
              if(e.id === i.id){
                i.position = {x : 10, y: (index+1)*30+10}
              }
            })
          }
        })
        // 重新校准规则节点的显示位置后重新计算模块节点高度
        smallNodeIndex.value = item.data.children.length;
        let parentN = nodes.value.find(e => e.id === data.label);
        // 实时获取当前所在模块的高度
        heightB.value = parseInt(parentN.style.height.split('px')[0]);
        // 每个子节点高度20px，加上每两个子节点之间的margin为10px
        if(smallNodeIndex.value*30 + 40 > 300){
          heightB.value = smallNodeIndex.value*30 + 40;
          parentN.style.height = heightB.value + 'px';
        } else {
          heightB.value = 300;
          parentN.style.height = heightB.value + 'px';
        }
      }
    })

    //删除操作完成，将childrenSetting清空
    childrenSetting.value = [];
    //重新计算模块节点的高度
    ElMessage({
      type: 'success',
      message: '删除成功!',
    });
  }).catch((e) => {
    ElMessage({
      type: 'info',
      message: '已取消删除',
    });
  });
}

// 用来从数组 A 中删除数组 B 的元素
const removeElementsFromArrayA = (arrayA, arrayB) => {
  // 使用 filter 方法过滤掉数组 A 中存在的数组 B 的元素
  let arr = arrayA.filter(itemA => !arrayB.some(itemB => itemA.id === itemB.id))
  return arr;
}

// 删除模块
const deleteModules = () => {
  // 删除节点要将其对应的连线及下属子节点全部删除
  if(parentSetting.value.length <= 0){
    return;
  }
  ElMessageBox.confirm('此操作将删除该模块及所有所属规则, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // *************删除涉及到的边************
    edges.value = edges.value.filter(item => { 
      // parentSetting.value中存放了所有需要删除的大节点
      // some 方法来检查 parentSetting 中是否存在至少一个对象，其 id 属性与 edges 中当前元素的 source或target 属性相匹配。
      return !parentSetting.value.some(obj => {return (obj.id === item.source || obj.id === item.target)}) 
    })
    
    // *************删除 parentSetting 中包含的规则************
    parentSetting.value.forEach(item => {
      let rulesArr = item.data.children;
      // 先删除规则节点的相关edges
      edges.value = edges.value.filter(e => { 
        return !rulesArr.some(obj => {return (obj.id === e.source || obj.id === e.target)}) 
      })
      // 再删除规则节点
      nodes.value = nodes.value.filter(e => { 
        return !rulesArr.some(obj => obj.id === e.id) 
      })
    })

    // *************删除模块************
    nodes.value = nodes.value.filter(item => { 
      // parentSetting.value中存放了所有需要删除的大节点
      // some 方法来检查 parentSetting 中是否存在至少一个对象，其 id 属性与 nodes 中当前元素的 id 属性相匹配。
      return !parentSetting.value.some(obj => obj.id === item.id) 
    })
    //删除操作完成，将parentSetting清空
    parentSetting.value = [];
    ElMessage({
      type: 'success',
      message: '删除成功!',
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除',
    });
  });
}

// 更新target集
const updataTarget = (e) => {
  targetValue.value.newValue = e
}

// 更新模块ID
const updateRules = (data) => {
  if(data.newValue){
    // 更新可选target
    settingValue.value.target.find(item => {
      if(item.value === data.oldValue){
        item.value = data.newValue;
        item.label = data.newValue;
      }
    })
    // 更新模块及data中的信息
    parSetting.value = nodes.value.find(e => e.id === data.label);
    if(parSetting.value){
      parSetting.value.id = data.newValue;
      parSetting.value.data.label = data.newValue;
      // ?待优化
      nodes.value.forEach(e => {
        parSetting.value.data.children.forEach(i => {
          if(e.id === i.id){
            e.parentNode = data.newValue;
            e.data.target = data.newValue;
          }
        })
      })
    }
    // 若更新模块名称时该模块有连线，处理连线
    let edge = ''
    let thisEdge = edges.value.find(item => item.source === data.oldValue || item.target === data.oldValue)
    if(thisEdge){
      edges.value.filter(item => {
        let qp = nodes.value.find(e => e.id === item.source)?.data.qp;
        if(item.source === data.oldValue){
          edge = {
            id: `e${data.newValue}~${item.target}`, 
            qp: qp,
            zIndex: 1050,
            // type: 'step',   // 连线样式
            source: data.newValue, 
            target: item.target,
            sourceHandle: `${data.newValue}_right`,
            targetHandle: `${item.target}_left`,
            markerEnd: MarkerType.ArrowClosed
          }
        } else if (item.target === data.oldValue) {
          edge = {
            id: `e${item.source}~${data.newValue}`, 
            qp: qp,
            zIndex: 1050,
            // type: 'step',   // 连线样式
            source: item.source, 
            target: data.newValue,
            sourceHandle: `${item.source}_right`,
            targetHandle: `${data.newValue}_left`,
            markerEnd: MarkerType.ArrowClosed
          }
        }
        removeEdges(item.id)
        nextTick( () => {
          addEdge(edge)
        })
      })
      updateNewInfo(data.newValue)
    } else {
      console.log('无连线')
    }
    // 过程中发现更新模块id后浏览器缓存未实时更新，此处用于更新模块节点的最新信息
    updateNewInfo(data.label)
    CustomNodeRef.value.setData();
  }
}

// 添加节点
const addNode = (nodeType,data) => {
  if(nodeType === 's'){
    // 需计算隶属于哪个父节点的子节点、该父节点已有子节点数量并据此计算本次添加子节点的添加位置
    // 需要的数据汇总：
    // 本节点id(注意命名)、parentNode值(指向父节点label)
    // data中--->{qp、type、bank、trxtype}
    // 子节点数量，由于后面步骤会增加一个子节点，这里需要计算该子节点已加入后的情况
    smallNodeIndex.value = nodes.value.filter(e => {return e.parentNode === data.label}).length + 1;
    // 动态设置父节点的高度
    let parentN = nodes.value.find(e => e.id === data.label);
    heightB.value = parseInt(parentN.style.height.split('px')[0]);
    // 每个子节点高度20px，加上每两个子节点之间的margin为10px
    if(heightB.value < smallNodeIndex.value*30 + 40){
      heightB.value += 30;
      parentN.style.height = heightB.value + 'px';
    }
    nodes.value.push({
      id: `${data.label}_${smallNodeIndex.value}`,
      type: 'customNode',
      position: { x: 10, y: smallNodeIndex.value*30+10 },
      parentNode: data.label,
      isChild: true,
      data: { 
        qp: '0',
        type: 'all',
        bank: '0000',
        trxtype: '0000',
        target: '',
        isChild: true,
        label: `${data.label}_${smallNodeIndex.value}`,
      },
      style: {
        ...usualSmallStyle.value
      },
    });
    parentN.data.children.push({id: `${data.label}_${smallNodeIndex.value}`});
    // 重置规则表单 
    form.qp = "";
    form.bank = "";
    form.type = "";
    form.trxtype = "";
    form.target = "";
  } else {
    // 需计算隶属于哪个父节点的子节点、该父节点已有子节点数量并据此计算本次添加子节点的添加位置
    // 需要的数据汇总：
    // 本节点id(需要通过传参获得)
    bigNodeIndex.value = nodes.value.filter(e => {return e.isParent === true}).length;
    ElMessageBox.prompt('请输入模块名称', 'Tip', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
      .then(({ value }) => {
        let posi = getPosition(bigNodeIndex.value, value);
        nodes.value.push({
          id: value,
          topic: "",
          type: 'module',
          position: { x: posi.x, y: posi.y },
          isParent: true,
          parentNode: null,
          data: { 
            label: value,
            isParent: true,
            children: [],
          },
          style: {
            ...usualBigStyle.value
          },
        })
        if(value.indexOf('bankcomm') > -1){
          // bankcomm模块节点背景色
          nodes.value.find(item => {return item.id === value}).style.backgroundColor = '#E9F5FF'
        } else if(value.indexOf('bridge') > -1){
            // 其他模块节点背景色
            nodes.value.find(item => {return item.id === value}).style.backgroundColor = '#E9FFFF';
        } else if(value.indexOf('cupdcomm') > -1){
            // 其他模块节点背景色
            nodes.value.find(item => {return item.id === value}).style.backgroundColor = '#F5E8FF';
        } else {
            // 其他模块节点背景色
            nodes.value.find(item => {return item.id === value}).style.backgroundColor = '#FFE0BF';
        }
        // 重置模块表单
        bigNodeIndex.value++;
        // 重置规则表单
        settingValue.value.target.push({ label: value, value: value })
      })
      .catch(() => {})
  }
}

// 直接添加模块
const dragModule = (type) => {
  let bankcomm = [];
  let nonBankcomm = [];
  // 模块节点个数
  bigNodeIndex.value = nodes.value.length;
  nodes.value.forEach(item => {
      if (item.id.indexOf('bankcomm') > -1 && item.isParent){
          bankcomm.push(item);
      } else if (item.id.indexOf('bankcomm') === -1 && item.isParent){
          nonBankcomm.push(item);
      }
  });
  let posi = '';
  if(type === 'bankcomm'){
    // bankcomm模块节点背景色及位置
    posi = getPosition(bigNodeIndex.value, `bankcomm${bigNodeIndex.value}`);
    nodes.value.push({
      id: `bankcomm${bankcomm.length}`,
      topic: "",
      type: 'module',
      position: { x: posi.x, y: posi.y },
      isParent: true,
      parentNode: null,
      data: { 
        label: `bankcomm${bankcomm.length}`,
        isParent: true,
        children: [],
      },
      style: {
        ...usualBigStyle.value
      },
    })
    // bankcomm模块节点背景色
    nodes.value.find(item => {return item.id === `bankcomm${bankcomm.length}`}).style.backgroundColor = '#E9F5FF';
    // 重置规则表单
    settingValue.value.target.push({ label: `bankcomm${bankcomm.length}`, value: `bankcomm${bigNodeIndex.value}` })
  } else {
    // 其他模块节点背景色及位置
    posi = getPosition(bigNodeIndex.value, `module${bigNodeIndex.value}`);
    nodes.value.push({
      id: `module${nonBankcomm.length}`,
      topic: "",
      type: 'module',
      position: { x: posi.x, y: posi.y },
      isParent: true,
      parentNode: null,
      data: { 
        label: `module${nonBankcomm.length}`,
        isParent: true,
        children: [],
      },
      style: {
        ...usualBigStyle.value
      },
    })
    // 其他模块节点背景色
    nodes.value.find(item => {return item.id === `module${nonBankcomm.length}`}).style.backgroundColor = '#FFE0BF';
    // 重置规则表单
    settingValue.value.target.push({ label: `module${nonBankcomm.length}`, value: `module${bigNodeIndex.value}` })
  }
}

// 添加边
const addEdge = (e) => {
  let qp = nodes.value.find(item => item.id === e.source)?.data.qp;
  let newEdge = { 
    id: `e${e.source}~${e.target}`, 
    qp: qp,
    zIndex: 1050,
    // type: 'step',   // 连线样式 
    source: e.source, 
    target: e.target,
    style: { stroke: '#ccc' },
    sourceHandle: e.sourceHandle,  // 使用节点 node1 的 left 句柄作为起点(sourceHandle为source节点的id)
    targetHandle: e.targetHandle,  // 使用节点 node2 的 right 句柄作为终点(targetHandle为target节点的id) 
    markerEnd: MarkerType.ArrowClosed
  };
  nodes.value.find(item => {
    if(item.id === e.source){
      item.data.target = e.target;
    }
  })
  edges.value.push(newEdge)
}

// 删除边 
const removeEdges = (id) => {
  if(id){
    edges.value = edges.value.filter(item => item.id !== id)
  }
}

// 修改规则内容
const confirmOption = () => {
  let node = "";
  node = nodes.value.find(item => {return item.id === childSetting.value.id});
  // 由于data中有其他属性，故不能直接使用node.data = form
  node.data.qp = form.qp;
  node.data.type = form.type;
  node.data.bank = form.bank;
  node.data.trxtype = form.trxtype;

  // 更改target后的新线
  if(form.target && form.target !== childSetting.value.parentNode && targetValue.value.newValue) {
    node.data.target = form.target;
    // 连线
    let nodeE = "";
    nodeE = nodes.value.find(item => {return item.id === childSetting.value.id});
    let qp = nodes.value.find(item => item.id === nodeE.id)?.data.qp;
    let edge = {
      id: `e${nodeE.id}~${form.target}`, 
      qp: qp,
      zIndex: 1050,
      // type: 'step',   // 连线样式 
      source: nodeE.id, 
      target: form.target,
      sourceHandle: `${nodeE.id}_right`,
      targetHandle: `${form.target}_left`,
      markerEnd: MarkerType.ArrowClosed  // 箭头
    }
    // 添加新线
    addEdge(edge);
    // 删除更改target之前的老线
    removeEdges(`e${nodeE.id}~${targetValue.value.oldValue}`)
  }

  // 调用子节点的赋值函数
  CustomNodeRef.value.setData();
  dialogFormVisible.value = !dialogFormVisible.value;
  // 重置
  targetValue.value.newValue = ""
  targetValue.value.oldValue = ""
}

// 连线开始
const onConnectStart = (e) => {
  let edge = edges.value.find(item => item.source === e.nodeId)
  if(!edge) {
    childSetting.value = nodes.value.find(item => item.id === e.nodeId)
  }
}

// 连线触发
const onConnect = (e) => {
  let edge = edges.value.find(item => item.source === e.source)
  if(edge){
    // 禁止单条规则连接多个模块
    ElMessage({
      type: 'info',
      message: '禁止单条规则连接多个模块',
    });
    return false
  }
  nodes.value.find(item => {
    if(item.id === e.target){
      if(item.isChild){
        // 禁止直接连接子节点
        ElMessage({
          type: 'info',
          message: '禁止直连规则',
        });
        return false
      } else {
        addEdge(e)
      }
    }
  })
}

// 连线结束
const onConnectEnd = (e) => {
  // console.log('连线结束',e)
}

// 用于计算子节点是否在父节点中
const calculation = (node) => {
  let isIn = false;
  //获取到node的父节点
  let parentNode = nodes.value.find(item => {
    return item.id === node.parentNode
  })
  if(parentNode){
    //父节点范围
    let parentNodex = parentNode.position.x;
    let parentNodey = parentNode.position.y;
    let parentNodeXRange = parentNode.position.x + parseInt(parentNode.style.width.split('px')[0]);
    let parentNodeYRange = parentNode.position.y + parseInt(parentNode.style.height.split('px')[0]);

    //子节点范围
    let childNodex = node.position.x;
    let childNodey = node.position.y;
    let childNodeXRange = node.position.x + parseInt(node.style.width.split('px')[0]);
    let childNodeYRange = node.position.y + parseInt(node.style.height.split('px')[0]);
    if(childNodex >= parentNodex && 
      childNodeXRange <= parentNodeXRange && 
      childNodey >= parentNodey && 
      childNodeYRange <= parentNodeYRange){
      isIn = true;
    } else {
      isIn = false;
    }
  }
  return isIn;
}

// 节点拖动开始
const onNodeDragStart = (event) => {
}

// 节点拖动结束后更新节点位置(只支持父节点拖动)
const onNodeDragStop = (event) => {
  const { node } = event;
  // 判断是否为父节点
  if (node.isParent) {
    nodes.value.filter(item => {
      if(item.id === node.id){
        // 更新节点位置
        item.position = node.position;
      }
    })
  }
}

// 关闭规则设置框
const dialogFormClose = () => {
  // 清空设置
  form.qp = "";
  form.type = "";
  form.bank = "";
  form.trxtype = "";
  form.target = "";
  dialogFormVisible.value = false;
}

// 单击选中节点
const onNodeSClick = (event) => {
  nextTick(() => {
    if(event.node.isChild){
      // 单击选中该子节点
      let str = childrenSetting.value.find(item => {return item.id === event.node.id});
      if(!str){
        // 选中添加项
        childrenSetting.value.push(event.node);
        // 选中的节点边框加粗
        childrenSetting.value.forEach(item => item.style.border = '3px solid #b3d9ff');
      } else {
        // 取消删除项
        let indexToRemove = childrenSetting.value.findIndex(item => item.id === event.node.id);
        // 选中的节点边框恢复
        if(indexToRemove !== -1){
          childrenSetting.value[indexToRemove].style.border = '1px solid #ccc';
          // 删除选中项
          childrenSetting.value.splice(indexToRemove, 1)
        }
      }
    } else {
      // 单击选中该父节点
      let str = parentSetting.value.find(item => {return item.id === event.node.id});
      if(!str){
        parentSetting.value.push(event.node);
        parentSetting.value.forEach(item => item.style.border = '3px solid #b3d9ff');
      } else {
        // 取消删除项
        let indexToRemove = parentSetting.value.findIndex(item => item.id === event.node.id);
        if(indexToRemove !== -1){
          parentSetting.value[indexToRemove].style.border = '1px solid #ccc';
          parentSetting.value.splice(indexToRemove, 1)
        }
      }
    }
  })
}

// 用于选中边
const onEdgeClick = (event) => {
  console.log('Edge clicked:', event);
}

// 导出 yaml 文件
const exportConfig = () => {
    const config = {
      nodes: nodes.value,
      edges: edges.value,
    };
    const yamlConfig = jsYaml.dump(config);
    const blob = new Blob([yamlConfig], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.yaml';
    a.click();
    URL.revokeObjectURL(url);
}
</script>
 
<style>
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";
 
/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";
@import '@vue-flow/controls/dist/style.css';
.formatted-json {
  white-space: pre-wrap; /* 保留空格和换行符 */
  word-wrap: break-word; /* 防止长单词溢出容器 */
  font-family: monospace; /* 使用等宽字体以保持对齐 */
  border: 1px solid #dcdfe6; /* 可选：添加边框以模拟文本框外观 */
  padding: 10px; /* 可选：添加内边距以改善视觉效果 */
  overflow-y: auto; /* 可选：添加垂直滚动条以防止内容溢出 */
}
.vue-flow-container {
  margin: 0;
  width: 90vw;
  height: 90vh;
}
 
.custom-big-node {
  position: relative;
}
 
.custom-small-node {
  cursor: pointer;
}

.demo-form-inline {
  display: flex;
  flex-direction: column;
}
.demo-form-inline .el-form-item {
  margin-bottom: 10px;
}

.center-content {
  display: flex !important;
  justify-content: right; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 确保父容器有高度 */
}
</style>