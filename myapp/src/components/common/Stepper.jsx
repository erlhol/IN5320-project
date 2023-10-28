import React from "react";
import {Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip, Chip} from '@dhis2/ui'
import Search from "./Search";

const Step = (props) => {
    return (
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <Chip>
                {props.step}
            </Chip>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
                <p>Step {props.step}</p>
                <p>{props.step_name}</p>
            </div>
        </div>
    )
}

const Stepper = (props) => {
    
    /* props.step1, props.step2, props.step3 */
    return (<Modal onClose={() => props.onClose('')} large>
        <ModalTitle>
            {props.title}
        </ModalTitle>
        <ModalContent>
            <div style={{display: 'flex', gap: '10px'}}>
                {/* Steps: */}
                <div style={{display: 'flex', gap: '20px', flexDirection: 'column'}}>
                    <Step step={1} step_name={'Commodity'}></Step>
                    <Step step={2} step_name={'Additional information'}></Step>
                    <Step step={3} step_name={'Dispensing summary'}></Step>
                </div>
                {/* Main section */}
                <div>
                    <h3>Commodity section</h3>
                    <Search placeholder='Search commodity' width={'320px'}></Search>
                </div>
            </div>
            
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={() => console.log("Hei")} secondary>
                    Previous
                </Button>
                <Button onClick={() => console.log("Hei")} primary>
                    Next
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>)
}
export default Stepper;