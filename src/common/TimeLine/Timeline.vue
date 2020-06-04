<script>
  export default {
    name: 'ElTimeline',
    props: {
      reverse: {
        type: Boolean,
        default: false
      }
    },
    provide() {
      return {
        timeline: this
      };
    },
    render(h) {
      const reverse = this.reverse;
      const classes = {
        'el-timeline': true,
        'is-reverse': reverse
      };
      let slots = this.$slots.default || [];
      if (reverse) {
        slots = slots.reverse();
      }
      return (<ul class={ classes }>
        { slots }
      </ul>);
    }
  };
</script>
<style lang="scss" scoped>
.el-timeline {
    margin: 0;
    font-size: 14px;
    list-style: none
}
</style>