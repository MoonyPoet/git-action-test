<script>
 function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }
 function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }
function isDef (v) {
    return v !== undefined && v !== null
  }
function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
}

 function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }
/**
 * opts VNodeComponentOptions
 */
function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

/**
 * 匹配规则
 * pattern: string | RegExp | Array<string>
 * name: string
 * return: boolean
 */
function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
/**
 * 修剪缓存
 * keepAliveInstance: any, filter: Function
 */
function pruneCache (keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

/**
 * 修剪缓存入口
 *  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
 */
function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  const cached = cache[key]
  // 主动执行某个组件的destory，触发destroy钩子，达到销毁目的，然后移除缓存中的key-value
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  delete cache[key] 
  remove(keys, key)
}


function findComponentPath(cache,key){
  return cache[key].parent.context.activeIndex;
}
function upSetLastRouter(route){
  this.lastRoute=route;
}

//该组件设计思路是一开始缓存所有组件,如果是页面修改添加之后,返回的页面则不进行缓存,考虑到添加编辑可能有部分数据变化，添加编辑页面不进行缓存
export default {
  name: 'alive',
  // 抽象组件
  abstract: true,
  // 定义include、exclude及max属性
  // include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
  // exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
  // max - 数字。最多可以缓存多少组件实例。
  props: {
    include: Array,
    exclude: Array,
    // routerPath:String,
    isCache:Boolean,
    max: [String, Number]
  },
   data() {
    return {
     cacheArr:[]
    };
  },
  created () {
   // 组件创建时创建缓存对象
    Object.assign(this, {
      cache: Object.create(null),
      lastRoute: this.$route,
      keys:[]
    })
  },

  destroyed () {
     // 销毁时清除所有缓存
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    // 监听include和exclue，使其支持双向绑定
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
    // this.watchRoute()
  },
  methods:{
    watchRoute(val,oldVal){
      // if(val.path.search(/add|edit/)>-1){
      //       this.cleanAddEditCache()
      // }
      // //从新增编辑返回的时候，更新页面
      // if(oldVal.path.search(/add|edit/)>-1){
      //   this.cleanBackCache(val.path)
      // }
      //只有从详情返回列表的时候才不更新其他都更新
      // this.cacheArr.push(oldVal,val)
     
      if(this.cacheArr.length===0){
         this.cacheArr.push(val.path)
      }else{
         
        //防止递归
        if(this.cacheArr[this.cacheArr.length-1]&&val.path!==this.cacheArr[this.cacheArr.length-1]){
          this.cacheArr.push(val.path)
          let len=this.cacheArr.length-1;
          if(this.cacheArr[len-1]&&this.cacheArr[len-1].search("detail")>-1&&this.cacheArr[len].search(/add|edit/)===-1){
            //不更新
          }else{
            let path=/\w+$/.exec(val.path);
            this.cleanCurRouteCache(path);
          }
          if(this.cacheArr.length>2){
            //防止数组过多
            this.cacheArr.shift();
          }
        }
      }
      
     
     
    },
     cleanAddEditCache(){
       for (const key in this.cache) {
           if(this.cache[key]){
             if(this.cache[key].tag.search(/add|edit/)>-1){
               pruneCacheEntry(this.cache,key,this.keys,this._vnode)
              }
           }
        } 
    },
    cleanCurRouteCache(path){
       for (const key in this.cache) {
           if(this.cache[key]){
             if(this.cache[key].tag.search(path)>-1){
               pruneCacheEntry(this.cache,key,this.keys,this._vnode)
              }
           }
        } 
    },
    cleanBackCache(path){
      for (const key in this.cache) {
          if(this.cache[key]){
            if(this.cache[key].tag.search(path.split(/^\//)[1])>-1){
             pruneCacheEntry(this.cache,key,this.keys,this._vnode)
              
            }
          }
        } 
    },
    // 通过路由地址刷新页签
    refresh (location, fullMatch = true) {
      if (location) {
        let id = this.getIdByLocation(location, fullMatch)
        if (id) {
          this.refreshTab(id)
        }
      } else {
        this.refreshTab()
      }
    },

    // 刷新指定页签
    async refreshTab (id = this.activedTab) {
      try {
        await this.pageLeavePromise(id, 'refresh')
        this.$refs.routerAlive.clear(id)
        if (id === this.activedTab) this.reloadView()
      } catch (e) {}
    },

    /**
     * 刷新所有页签
     * @param {boolean} [force=false] 是否强制刷新，如果强制则忽略页面 beforePageLeave
     */
    async refreshAll (force = false) {
      const $alive = this.$refs.routerAlive
      const { cache } = $alive
      for (const id in cache) {
        if (!force) {
          try {
            await this.pageLeavePromise(id, 'refresh')
            $alive.clear(id)
          } catch (e) {}
        } else {
          $alive.clear(id)
        }
      }
      this.reloadView()
    },

    // 重载路由视图
    async reloadView (ignoreTransition = false) {
      this.isViewAlive = false

      // 默认在页面过渡结束后会设置 isViewAlive 为 true
      // 如果过渡事件失效，则需传入 ignoreTransition 为 true 手动更改
      if (ignoreTransition) {
        await this.$nextTick()
        this.isViewAlive = true
      }
    },
    // 从路由地址获取 aliveId
    getIdByLocation (location, fullMatch = true) {
      if (!location) return

      let route = this.$router.match(location, this.$router.currentRoute)

      // 路由地址精确匹配页签
      if (fullMatch) {
        let matchPath = this.getPathWithoutHash(route)
        let matchTab = this.items.find(({ to }) => to.split('#')[0] === matchPath)

        if (matchTab) {
          return matchTab.id
        }
      } else {
        return this.getAliveId(route)
      }
    },
  },
  render () {
    // $slots.default表示slot中的所有子组件（包括换行）
    const slot = this.$slots.default
    // 获取第一个组件（这就是为什么keep-alive中只允许渲染一个直属子组件，而不能用v-for的原因）
    const vnode = getFirstComponentChild(slot)
    const componentOptions = vnode && vnode.componentOptions
    const {$route,lastRoute} =this;
    this.watchRoute($route,lastRoute);
    upSetLastRouter.call(this,$route);
    
    // 通过找到组件的name 缓存组件
    if (componentOptions) {
      // 获取子组件名称
      const name = getComponentName(componentOptions)
      // 验证组件名称的name是否包含在include或者不在exclude中
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        // 通过缓存获取，直接加载组件
        return vnode
      }

      const { cache, keys } = this
      // 获取key值
      const key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key;
      // 如果key队友的vnode存在，则更新key值
      if (cache[key]) {
        // console.log(1)
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        // console.log(2)
        // 否则将vnode存入缓存
        //如果当前页面的路由是add或者edit则不写入缓存
        if(this.$route.path.search(/add|edit/)===-1){
          cache[key] = vnode
          keys.push(key)
        }
        // 如果超出max则将第一个缓存的vnode移除
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
        // 如果超出max则将第一个缓存的vnode移除
      if (this.max && keys.length > parseInt(this.max)) {
        pruneCacheEntry(cache, keys[0], keys, this._vnode)
      }
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
</script>