import { ref } from "vue";
import { Position } from "@vue-flow/core";
//小节点通用style
const usualSmallStyle = ref({
    width: '320px',
    height: '20px',
    background: '#e0e0e0',
    border: '1px solid #bbb',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
})
//大节点通用style
const usualBigStyle = ref({
    width: '340px',
    height: '300px',
    background: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', //水平居中
    //justifyContent: 'center', //垂直居中
    paddingTop: '2px',
    paddingLeft: '10px',
})
// 响应
let obj = {
    code: '0', //成功
    data: {
        "modules": {
            "cupdfe-bankcomm": [
                { qp: 0, type: 'all', trxtype: '0000', bank: '0000', routeType: 'I', target: 'cupdfe-bridge'}
            ],
            "cupdfe-bridge": [
                { qp: 9, type: 'fix', trxtype: '0000', bank: '0000', routeType: 'I', target: 'cupdfe-fix' },
                { qp: 9, type: 'iso', trxtype: '0000', routeType: 'I', target: 'cupdfe-iso' },
                { qp: 1, type: 'iso', trxtype: '0830', bank: '0000', routeType: 'I', target: 'cupdfe-secret' },
            ],
            "cupdfe-fix": [
                { qp: 0, type: 'fix', trxtype: '0000', bank: '0000', routeType: 'I', target: 'cupdfe-cupdcomm' }
            ],
        }
    },
    msg: ''
}
// 格式化数据
const transformData = (data) => {
    if (!data.modules){
        return
    }
    // 获取 modules 对象中所有模块的键
    let moduleNames = Object.keys(data.modules);

    // 遍历所有模块
    moduleNames.forEach((moduleName, index) => {
        // 获取当前模块的规则
        let arr = [];
        let obj = data.modules[moduleName];
        // 对规则节点进行加工，包括生成节点和连线
        obj.forEach((customNode, index) => {
            let id = `${moduleName}_${index}`;
            let child = {
                id: id,
                type: 'customNode',
                position: { x: 10, y: (index + 1) * 30 + 10 },
                parentNode: moduleName,
                isChild: true,
                data: {
                    qp: customNode.qp,
                    type: customNode.type,
                    bank: customNode.bank ? customNode.bank : '0000',
                    trxtype: customNode.trxtype,
                    target: customNode.target,
                    isChild: true,
                    label: id,
                },
                style: {
                    ...usualSmallStyle.value
                },
            }
            let edge = {
                id: `e${id}~${customNode.target}`,
                zIndex: 1050,
                // type: 'straight',   // 连线样式
                source: id,
                target: customNode.target,
                style: { stroke: '#ccc' },
                sourceHandle: `${id}_right`,  // 使用节点 node1 的 left 句柄作为起点(sourceHandle为source节点的id)
                targetHandle: `${customNode.target}_left`  // 使用节点 node2 的 right 句柄作为终点(targetHandle为target节点的id) 
            };
            arr.push({ id: `${moduleName}_${index}` });
            nodes.value.push(child);
            edges.value.push(edge);
        })

        // 对当前模块的内容进行加工
        let module = {
            id: moduleName,
            type: 'module',
            isParent: true,
            position: { x: 50 + (340 + 50) * index, y: 5 },
            data: {
                label: moduleName,
                isParent: true,
                children: arr,
            },
            style: {
                ...usualBigStyle.value
            },
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            classes: ['custom-big-node'],
        }
        nodes.value.push(module)
    });
}
// 保存配置(将nodes转为需要的数据结构)
const saveConfig = (nodes) => {
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
    console.log('最终参数', obj)
}
const nodes = ref([])
//节点设值
const nodes1 = ref([
    {
        id: 'cupdfe-bankcomm',
        type: 'module',
        isParent: true,
        position: { x: 50, y: 5 },
        data: {
            label: 'cupdfe-bankcomm',
            isParent: true,
            children: [{ id: 'cupdfe-bankcomm_1' }],
        },
        style: {
            ...usualBigStyle.value
        },
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
        classes: ['custom-big-node'],
    },
    {
        id: 'cupdfe-bankcomm_1',
        type: 'customNode',
        position: { x: 10, y: 40 },
        parentNode: 'cupdfe-bankcomm',
        isChild: true,
        data: {
            qp: '0',
            type: 'all',
            bank: '0000',
            trxtype: '0000',
            target: '',
            isChild: true,
            label: 'cupdfe-bankcomm_1',
        },
        style: {
            ...usualSmallStyle.value
        },
    }
]);

//边设值
const edges = ref([]);

//用于规则节点中两个属性的选项
const settingValue = ref({
    //由调用字典接口获取最新选项
    qp: [{ label: "请求", value: 0, disable: false }, { label: "响应", value: 1, disable: false }, { label: "全部", value: 9, disable: true }],
    type: [{ label: "fix", value: "fix", disable: false }, { label: "iso", value: "iso", disable: false }, { label: "all", value: "all", disable: true }],
    // qp: [],
    // type: [],

    // 注意，target选项由前端遍历当前节点树获取，主要对应模块节点的id，这里为了方便使用，label和value都使用id作为值
    target: [],
})

export { nodes, edges, usualBigStyle, usualSmallStyle, settingValue, transformData, saveConfig, obj }