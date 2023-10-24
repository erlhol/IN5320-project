import React from "react";
import {Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip} from '@dhis2/ui'
const Stepper = (props) => {
    
    return (<Modal large>
        <ModalTitle>
            This is a large modal with title, content and primary action
        </ModalTitle>
        <ModalContent>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={() => console.log("Hei")} secondary>
                    Secondary action
                </Button>
                <Button onClick={() => console.log("Hei")} primary>
                    Primary action
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>)
}
export default Stepper;