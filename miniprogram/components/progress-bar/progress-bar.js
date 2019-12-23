// components/progress-bar/progress-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime:{
      currentTime:'00:00',
      totalTime:'00-00',
    },
    movableDis:0,
    progress:0,
  },

  lifetimes:{
    ready(){
      this._getMovableDis()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getMovableDis(){
      const query=this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        console.log(rect)
      })
    },
  }
})
