import storeBrowser from "@/store/browser";
import { css, cx } from "@emotion/css";
import {
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  Ref,
  ref,
  toRefs,
} from "@vue/composition-api";
import ScrollBar from "./ScrollBar";
const xWidth = 14;
const yWidth = 14;
const seam = 0.005;
// x滚动条样式
const styXScroll = css`
  position: absolute;
  left: 0px;
  bottom: 0px;
`;
// y滚动条样式
const styYScroll = css`
  position: absolute;
  right: 0px;
  top: 0px;
`;
const VirtualScroll = defineComponent({
  props: {
    maxHeight: {
      type: Number,
    },
  },
  setup(props) {
    const { maxHeight } = toRefs(props);
    const wrapper: Ref<HTMLDivElement | null> = ref(null);
    const scrollContent: Ref<HTMLDivElement | null> = ref(null);
    const scroll: Ref<HTMLDivElement | null> = ref(null);
    const scrollWidth = ref(0);
    const scrollHeight = ref(0);
    const wrapperWidth = ref(0);
    const hasXScroll = ref(false);
    const hasYScroll = ref(false);
    // 获取容器尺寸
    function getSize() {
      if (!wrapper.value || !scrollContent.value) return;
      scrollWidth.value = scrollContent.value.scrollWidth;
      scrollHeight.value = scrollContent.value.scrollHeight;
      wrapperWidth.value = wrapper.value.clientWidth;
      let hasX = scrollWidth.value > wrapperWidth.value;
      let hasY = maxHeight?.value
        ? scrollHeight.value > maxHeight.value
        : false;
      if (hasX !== hasY) {
        hasX &&
          (hasY = maxHeight?.value
            ? scrollHeight.value > maxHeight.value - xWidth
            : false);
        hasY && (hasX = scrollWidth.value > wrapperWidth.value - yWidth);
      }
      hasXScroll.value = hasX;
      hasYScroll.value = hasY;
    }
    onMounted(() => {
      if (!scrollContent.value) return;
      const observer = new ResizeObserver(getSize);
      observer.observe(scrollContent.value);
    });
    onUpdated(getSize);
    // wrapper样式
    const styWrapper = computed(
      () => css`
        padding-bottom: ${hasXScroll.value ? xWidth : 0}px;
        padding-right: ${hasYScroll.value ? yWidth : 0}px;
        position: relative;
        max-height: ${maxHeight?.value}px;
      `
    );
    // hidden容器样式
    const hiddenWidth = computed(() =>
      hasYScroll.value ? wrapperWidth.value - yWidth : wrapperWidth.value
    );
    const hiddenHeight = computed(() =>
      maxHeight?.value && hasYScroll.value
        ? hasXScroll.value
          ? maxHeight.value - xWidth
          : maxHeight.value
        : 0
    );
    const styHidden = computed(
      () => css`
        /* width: ${hiddenWidth.value}px; */
        height: ${hiddenHeight.value ? `${hiddenHeight.value}px` : "auto"};
        overflow: hidden;
        box-sizing: border-box;
      `
    );
    // scroll容器样式
    const styScroll = computed(
      () => css`
        box-sizing: border-box;
        overflow: auto;
        margin-right: ${hasYScroll.value ? -storeBrowser.scrollYBarWidth : 0}px;
        margin-bottom: ${hasXScroll.value
          ? -storeBrowser.scrollXBarHeight
          : 0}px;
        height: ${hasYScroll.value
          ? `${
              hasXScroll.value
                ? hiddenHeight.value + storeBrowser.scrollXBarHeight
                : hiddenHeight.value
            }px`
          : "auto"};
      `
    );
    // 更新滚动块位置
    const xBlockRatio = computed(() => hiddenWidth.value / scrollWidth.value);
    const yBlockRatio = computed(() => hiddenHeight.value / scrollHeight.value);
    const xTranslateRatio = ref(0);
    const yTranslateRatio = ref(0);
    const updateTranslateRadioFactory = (type: "x" | "y") => {
      const maxTranslateRatio =
        1 - (type === "x" ? xBlockRatio.value : yBlockRatio.value);
      return (updateRadio: number) => {
        if (updateRadio < 0 || updateRadio > maxTranslateRatio) return;
        let currentRadio = updateRadio;
        if (updateRadio < seam) currentRadio = 0;
        if (updateRadio > maxTranslateRatio - seam)
          currentRadio = maxTranslateRatio;
        type === "x"
          ? (xTranslateRatio.value = currentRadio)
          : (yTranslateRatio.value = currentRadio);
        const xCurrentRadio =
          type === "x" ? currentRadio : xTranslateRatio.value;
        const yCurrentRadio =
          type === "y" ? currentRadio : yTranslateRatio.value;
        const xOffset = xCurrentRadio * scrollWidth.value;
        const yOffset = yCurrentRadio * scrollHeight.value;
        scroll.value?.scrollTo(xOffset, yOffset);
      };
    };
    onMounted(() => {
      if (!scroll.value) return;
      scroll.value.addEventListener("scroll", (e) => {
        const target = e.target as HTMLDivElement;
        const scrollTop = target.scrollTop;
        const scrollLeft = target.scrollLeft;
        xTranslateRatio.value = scrollLeft / scrollWidth.value;
        yTranslateRatio.value = scrollTop / scrollHeight.value;
      });
    });
    return {
      wrapper,
      scrollContent,
      scroll,
      hasXScroll,
      hasYScroll,
      styWrapper,
      styHidden,
      styScroll,
      hiddenWidth,
      hiddenHeight,
      xBlockRatio,
      yBlockRatio,
      xTranslateRatio,
      yTranslateRatio,
      updateTranslateRadioFactory,
    };
  },
  render() {
    return (
      <div class={cx(this.styWrapper, "czb-virtual-scroll")} ref="wrapper">
        <div class={this.styHidden}>
          <div ref="scroll" class={this.styScroll}>
            <div ref="scrollContent">
              {this.$slots.default ?? this.$scopedSlots.default?.(undefined)}
            </div>
          </div>
        </div>
        {this.hasXScroll ? (
          <ScrollBar
            class={styXScroll}
            type="x"
            barLength={this.hiddenWidth}
            barWidth={xWidth}
            blockRatio={this.xBlockRatio}
            translateRatio={this.xTranslateRatio}
            onUpdateTranslateRadio={this.updateTranslateRadioFactory("x")}
          ></ScrollBar>
        ) : undefined}
        {this.hasYScroll ? (
          <ScrollBar
            class={styYScroll}
            type="y"
            barLength={this.hiddenHeight}
            barWidth={yWidth}
            blockRatio={this.yBlockRatio}
            translateRatio={this.yTranslateRatio}
            onUpdateTranslateRadio={this.updateTranslateRadioFactory("y")}
          ></ScrollBar>
        ) : undefined}
      </div>
    );
  },
});

export default VirtualScroll;
