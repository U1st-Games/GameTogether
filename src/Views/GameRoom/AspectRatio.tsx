import * as React from "react"
import styled, {StyledFunction} from "styled-components";

const outerWrapper: StyledFunction<any> = styled.div
export const OuterWrapper = outerWrapper`
  position: relative;
  width: 100%;
  height: 0;
  /**
   * For human readability, the ratio is expressed as
   * width / height, so we need to invert it.
   */
  padding-bottom: ${(props: any) => (1 / props.ratio) * 100}%;
`
export const InnerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

interface Props {
    children?: any
    /**
     * The width divided by the height. This ratio can be passed in
     * using JavaScript division syntax. So, to get a 16:9 ratio,
     * simply pass `ratio={16/9}`.
     */
    ratio: number
}
const AspectRatio = ({ children, ratio }: Props) => (
    <OuterWrapper ratio={ratio}>
        <InnerWrapper>
            {children}
        </InnerWrapper>
    </OuterWrapper>
);

export default AspectRatio;
