import React, { useState } from 'react';
import { Form, Input, Grid, Label, Icon } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { useSubstrate } from './substrate-lib';

export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ threshold:1, approvers: '', remark: '', addressTo: null, amount: 0 });
  const { accountPair } = props;
  const { threshold, approvers, remark, addressTo, amount } = formState;
  const { api } = useSubstrate();

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));

  return (
    <Grid.Column width={8}>
      <h1>Multisignature Transaction (System.Remark)</h1>
      <Form>          
        <Form.Field>
           <Input
             fluid
             label='Threshold'
             type='number'
             placeholder='u16'
             state='threshold'
             onChange={onChange}
           />
         </Form.Field>
         <Form.Field>
           <Input
             fluid
             label='other_signatories'
             type='text'
             placeholder='Vec<AccountId>'
             state='approvers'
             onChange={onChange}
           />
         </Form.Field>
         <Form.Field>
          <Input
            fluid
            label='Remark'
            type='text'
            placeholder='...'
            state='remark'
            onChange={onChange}
          />
        </Form.Field>
         <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
             accountPair={accountPair}
             label='Submit'
             type='SIGNED-TX'
             setStatus={setStatus}
             attrs={{
              palletRpc: 'multisig',
              callable: 'asMulti',
              inputParams: [threshold, approvers.split(','), null, api.tx.system.remark(remark), false, 10000000],
              paramFields: [true, true, { optional: true }, true, true, true]
            }}
           />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
