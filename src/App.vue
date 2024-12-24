<template>
  <div class="vue-flow-container">
    <el-row class="row-bg" justify="space-between">
      <el-col :span="6">
        <el-form ref="form1" :rules="rules" :model="formSearch" label-width="100px">
          <el-form-item label="qp" prop="qp">
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
      <el-col :span="6">
        <el-form ref="form2" :rules="rules" :model="formSearch" label-width="100px">
          <el-form-item label="type" prop="type">
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
      <el-col :span="6">
        <el-form ref="form3" :rules="rules" :model="formSearch" label-width="100px">
          <el-form-item label="bank" prop="bank">
            <!-- <el-input :prefix-icon="Search" size="small" v-model="formSearch.bank" /> -->
            <el-input size="small" v-model="formSearch.bank" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form ref="form4" :rules="rules" :model="formSearch" label-width="100px">
          <el-form-item label="trxtype" prop="trxtype">
            <!-- <el-input :prefix-icon="Search" size="small" v-model="formSearch.trxtype" /> -->
            <el-input size="small" v-model="formSearch.trxtype" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form ref="form5" :rules="rules" :model="formSearch" label-width="100px">
          <el-form-item label="inputModule" prop="inputModule">
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
      <!-- <el-button class="el-button el-button--primary is-plain" 
        size="small" type="info" round @click="exportConfig">下载</el-button> -->
    </el-row>
    <el-row>
      <el-col :span="6">
        <div class="grid-content ep-bg-purple-light" justify="end">
          <el-button class="el-button el-button--primary is-plain" 
            size="small" type="primary" round @click="addNode('b')">添加模块</el-button>
          <el-button :disabled="parentSetting.length <= 0" class="el-button el-button--primary is-plain" 
            size="small" type="success" round @click="deleteModules()">删除模块</el-button>
          <el-button class="el-button el-button--primary is-plain" 
            size="small" type="info" round @click="saveConfig(nodes)">保存配置</el-button>
          <el-button class="el-button el-button--primary is-plain" 
            size="small" type="info" round @click="searchNodes">搜索</el-button>
        </div>
      </el-col>
    </el-row>
      <!-- @node-double-click="exportConfig" 
      @node-drag-start="onNodeDragStart"
      :node-types="{ customNode: CustomNode, module: CustomModuleNode }"
      @node-drag-stop="onNodeDragStop" -->
    <VueFlow :nodes="nodes" :edges="edges" 
      @connect-start="onConnectStart"
      @connect="onConnect"
      @connect-end="onConnectEnd"
      @node-double-click="onNodeClick" 
      @node-click="onNodeSClick" 
      @edge-click="onEdgeClick"
      :default-viewport="{ zoom: 1.1 }"
      :min-zoom="0.2"
      :max-zoom="4"
      :node-types="{ customNode: CustomNode, module: CustomModuleNode }"
      style="height: 90vh; width: 90vw">
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

    <el-dialog v-model="dialogFormVisible" title="selecting rules" width="500">
      <el-form :model="form">
        <el-form-item label="qp" :label-width="formLabelWidth">
          <el-select size="small" v-model="form.qp" placeholder="请求相应标识">
            <el-option
              v-for="item in settingValue.qp"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="type" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="交易类型标识">
            <el-option
              v-for="item in settingValue.type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="bank" :label-width="formLabelWidth">
          <el-input v-model="form.bank" autocomplete="off" placeholder="银行编码" />
        </el-form-item>
        <el-form-item size="small" label="trxtype" :label-width="formLabelWidth">
          <el-input v-model="form.trxtype" autocomplete="off" placeholder="交易类行码" />
        </el-form-item>
        <el-form-item size="small" label="target" :label-width="formLabelWidth">
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
          <el-button size="small" @click="dialogFormClose">Cancel</el-button>
          <el-button size="small" type="primary" @click="confirmOption">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { nodes, edges, usualSmallStyle, usualBigStyle, settingValue, transformData, saveConfig, obj } from './components/vueflowJS'
import { reactive, ref, onMounted, nextTick } from "vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from '@vue-flow/background';
import { ControlButton, Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import Icon from './components/Icon.vue'
import jsYaml from 'js-yaml';
import CustomModuleNode from './components/SpecialNode.vue'; 
import CustomNode from './components/SpecialEdge.vue';
const { updateNodeData, applyEdgeChanges } = useVueFlow()
const heightB = ref()  //用于计算父节点动态高度
const formLabelWidth = ref(100);
const smallNodeIndex = ref(1);  //规则数量
const bigNodeIndex = ref(1); //模块数量
const dialogFormVisible = ref(false);
const childSetting = ref(); //选中的规则
const childrenSetting = ref([]); //选中规则的暂存
const parSetting = ref(); //选中的模块
const parentSetting = ref([]); //选中模块的暂存
const CustomNodeRef = ref(null);
const CustomModuleNodeRef = ref(null);
const form1 = ref();
const form2 = ref();
const form3 = ref();
const form4 = ref();
const form5 = ref();
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

onMounted(() => {
  //这里调用接口获取上次保存到库里的值
  transformData(obj.data)
  if(nodes.value.length > 0){
    nodes.value.filter(item => { return item.isParent === true })?.map(e => {
      // 不推荐在map中直接处理改变外部数据的逻辑，后续修改
      settingValue.value.target.push({ label: e.id, value: e.id })
    })
  }
})

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

// 设置高亮
const highlighted = (highlightedNodes) => {
  nodes.value.forEach(item => {
    if(highlightedNodes.has(item.id)){
      // 筛选到的节点高亮设置
      item.style.border = '3px solid #FFC0CB';
    } else {
      item.style.border = '1px solid #bbb';
    }
  });
  edges.value.forEach(item => {
    if(highlightedNodes.has(item.id)){
      // 筛选到的节点高亮设置
      item.style.stroke = '#FFC0CB';
      item.style.strokeWidth = 3;
    } else {
      item.style.stroke = '#ccc';
      item.style.strokeWidth = 1;
    }
  })
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
        if(item.source === data.oldValue){
          edge = {
            id: `e${data.newValue}~${item.target}`, 
            zIndex: 1050,
            // type: 'straight',   // 连线样式
            source: data.newValue, 
            target: item.target,
            sourceHandle: `${data.newValue}_right`,
            targetHandle: `${item.target}_left`
          }
        } else if (item.target === data.oldValue) {
          edge = {
            id: `e${item.source}~${data.newValue}`, 
            zIndex: 1050,
            // type: 'straight',   // 连线样式
            source: item.source, 
            target: data.newValue,
            sourceHandle: `${item.source}_right`,
            targetHandle: `${data.newValue}_left`
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
    ElMessageBox.prompt('Please input your module id', 'Tip', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    })
      .then(({ value }) => {
        nodes.value.push({
          id: value,
          type: 'module',
          position: { x: 50+(340+50) * bigNodeIndex.value, y: 5 },
          isParent: true,
          data: { 
            label: value,
            isParent: true,
            children: [],
          },
          style: {
            ...usualBigStyle.value
          },
        })
        bigNodeIndex.value++;
        settingValue.value.target.push({ label: value, value: value })
      })
      .catch(() => {})
  }
}

// 添加边
const addEdge = (e) => {
  let newEdge = { 
    id: `e${e.source}~${e.target}`, 
    zIndex: 1050,
    // type: 'straight',   // 连线样式 
    source: e.source, 
    target: e.target,
    style: { stroke: '#ccc' },
    sourceHandle: e.sourceHandle,  // 使用节点 node1 的 left 句柄作为起点(sourceHandle为source节点的id)
    targetHandle: e.targetHandle  // 使用节点 node2 的 right 句柄作为终点(targetHandle为target节点的id) 
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

  if(form.target && form.target !== childSetting.value.parentNode && targetValue.value.newValue) {
    node.data.target = form.target;
    // 连线
    let nodeE = "";
    nodeE = nodes.value.find(item => {return item.id === childSetting.value.id});
    let edge = {
      id: `e${nodeE.id}~${form.target}`, 
      zIndex: 1050,
      // type: 'straight',   // 连线样式 
      source: nodeE.id, 
      target: form.target,
      sourceHandle: `${nodeE.id}_right`,
      targetHandle: `${form.target}_left`
    }
    // 更改target后的新线
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
  // console.log('连线开始',e)
  childSetting.value = nodes.value.find(item => item.id === e.nodeId)
}

// 连线触发
const onConnect = (e) => {
  addEdge(e)
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
const onNodeDragStart = (event) => {
}
const onNodeDragStop = (event) => {
  const { node, nodes } = event;
  if (node.parent) {
    let inRange = calculation(node);
    const parentNode = nodes.find(n => {return n.id === node.parent});
    if (parentNode && inRange) {
      // 计算子节点相对于父节点的新位置
      const relativeX = node.position.x - parentNode.position.x;
      const relativeY = node.position.y - parentNode.position.y;
      // 更新子节点的位置
      node.position = {
        x: parentNode.position.x + relativeX,
        y: parentNode.position.y + relativeY,
      };
    }
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
        childrenSetting.value.push(event.node);
        childrenSetting.value.forEach(item => item.style.border = '3px solid #b3d9ff');
      } else {
        // 取消删除项
        let indexToRemove = childrenSetting.value.findIndex(item => item.id === event.node.id);
        if(indexToRemove !== -1){
          childrenSetting.value[indexToRemove].style.border = '1px solid #ccc';
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
  }
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
.vue-flow-container {
  margin: 0;
  width: 89vw;
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
</style>