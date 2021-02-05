import styled from "styled-components";
import {IonText} from "@ionic/react";
import {FontSize} from "../../constants/font-size";
import {Styles} from "../../utils/styles";
import {FontWeight} from "../../constants/font-weight";

const Text = styled(IonText)<{ fontSize?: FontSize, fontWeight?: FontWeight }>`
  ${({fontSize}) => Styles.serializeFontSize(fontSize)}
  ${({fontWeight}) => Styles.serializeFontWeight(fontWeight)}
`

export default Text;