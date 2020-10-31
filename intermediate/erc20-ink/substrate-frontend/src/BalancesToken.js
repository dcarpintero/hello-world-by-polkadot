import React, { useEffect, useState } from 'react';
import { Table, Grid, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSubstrate } from './substrate-lib';
import { Abi, ContractPromise } from "@polkadot/api-contract";
import tokenMetadata from "./contract/metadata.json";

export default function Main (props) {
  const { api, keyring } = useSubstrate();
  const accounts = keyring.getPairs();
  const [balances, setBalances] = useState({});

  const abi = new Abi(tokenMetadata);
  const address = "5DLD5xGD73wzT1xzgQT2u3RKRN11keCm2DDzJaLPBnaH7bag";

  const getBalanceOf = async (contract, address) => {
     return contract.query.balanceOf(address, 0, -1, address);
  };

  const getAllBalances = async (contract, addresses) => {
     return Promise.all(
       addresses.map((address) =>
         getBalanceOf(contract, address).then((result) => ({
           ...result,
           address,
         }))
       )
     );
  };

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address);
    let unsubscribeAll = null;
    const contract = new ContractPromise(api, abi, address);

    (async function anyNameFunction() {
      const allBalances = await getAllBalances(contract, addresses);
      let balanceMap = {};
      allBalances.map((data) => {
        if (data.result.isSuccess) {
          balanceMap[data.address] = data.output.toHuman();
        }
      });
      setBalances(balanceMap);
    })();

    return () => unsubscribeAll && unsubscribeAll();
  }, [api, keyring, setBalances]);

  return (
    <Grid.Column>
      <h1>Balances DC8 (ERC20 Token)</h1>
      <Table celled striped size='small'>
        <Table.Body>{accounts.map(account =>
          <Table.Row key={account.address}>
            <Table.Cell width={3} textAlign='right'>{account.meta.name}</Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {account.address}
              </span>
              <CopyToClipboard text={account.address}>
                <Button
                  basic
                  circular
                  compact
                  size='mini'
                  color='blue'
                  icon='copy outline'
                />
              </CopyToClipboard>
            </Table.Cell>
            <Table.Cell width={3}>{
              balances && balances[account.address] &&
              balances[account.address]
            }</Table.Cell>
          </Table.Row>
        )}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
