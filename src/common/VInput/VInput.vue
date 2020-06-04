<script>
    import {Input} from "element-ui";
    import {isEmpty} from "assets/js/reused";
     export default {
        extends:Input,
        name: 'ElInput',
        watch:{
            placeholder:{
                handler(newV,oldV){
                    console.log(newV)
                }
            }
        },
        mounted(){
            if(this.$el.children&&this.$el.children[0]&&this.$el.children[0].getAttribute("placeholder")){
                this.$el.setAttribute("title",this.$el.children[0].getAttribute("placeholder"))
            }
        }
    }
</script>