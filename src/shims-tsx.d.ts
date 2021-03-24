import { ComponentRenderProxy } from "@vue/composition-api";
import { VNode } from "vue";
import "vue-tsx-support/enable-check";
import "vue-tsx-support/options/enable-vue-router";

declare global {
  namespace JSX {
    /**
     * render函数返回类型
     */
    interface Element extends VNode {}
    /**
     * 基于值的元素的实例类型
     */
    interface ElementClass extends ComponentRenderProxy {}
    /**
     * 基于值的元素的属性类型
     */
    interface ElementAttributesProperty {
      $props: any; // specify the property name to use
    }
    /**
     * 固有元素的属性
     */
    interface IntrinsicElements extends VueTsxSupport.JSX.IntrinsicElements {}
  }
}
