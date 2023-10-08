import {
    Client,
    ContractId,
    PrivateKey,
    ContractExecuteTransaction,
    Status,
  } from '@hashgraph/sdk';
  
  async function insertDevices(newDevices: string[]) {
    const client = Client.forTestnet(); // or Mainnet
  
    const operatorPrivateKey = PrivateKey.fromString('your_private_key');
    const operatorAccountId = 'your_operator_account_id';
    client.setOperator(operatorAccountId, operatorPrivateKey);
  
    const contractId = ContractId.fromString('your_contract_id');
  
    try {
      const insertDevicesTx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunction('insertDevices', { newDevices })
        .execute(client);
  
      const insertDevicesReceipt = await insertDevicesTx.getReceipt(client);
      if (insertDevicesReceipt.status === Status.Success) {
        console.log('Devices inserted successfully');
      } else {
        console.error('Failed to insert devices');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      client.close();
    }
  }
  
  async function issuePayment(to: string, paymentId: number, value: number) {
    const client = Client.forTestnet(); // or Mainnet
  
    const operatorPrivateKey = PrivateKey.fromString('your_private_key');
    const operatorAccountId = 'your_operator_account_id';
    client.setOperator(operatorAccountId, operatorPrivateKey);
  
    const contractId = ContractId.fromString('your_contract_id');
  
    try {
      const issuePaymentTx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunction('issuePayment', { to, paymentId })
        .setMaxTransactionFee(1000000) // Adjust the gas fee as needed
        .execute(client);
  
      const issuePaymentReceipt = await issuePaymentTx.getReceipt(client);
      if (issuePaymentReceipt.status === Status.Success) {
        console.log('Payment issued successfully');
      } else {
        console.error('Failed to issue payment');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      client.close();
    }
  }
  
  async function retrievePendingIds() {
    const client = Client.forTestnet(); // or Mainnet
  
    const operatorPrivateKey = PrivateKey.fromString('your_private_key');
    const operatorAccountId = 'your_operator_account_id';
    client.setOperator(operatorAccountId, operatorPrivateKey);
  
    const contractId = ContractId.fromString('your_contract_id');
  
    try {
      const retrievePendingIdsTx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunction('retrievePendingIds')
        .execute(client);
  
      const retrievePendingIdsReceipt = await retrievePendingIdsTx.getReceipt(client);
      if (retrievePendingIdsReceipt.status === Status.Success) {
        const contractFunctionResult = retrievePendingIdsReceipt.getFunctionResult('retrievePendingIds');
        const pendingIds = contractFunctionResult.getUint16Array();
        console.log('Pending IDs:', pendingIds);
      } else {
        console.error('Failed to retrieve pending IDs');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      client.close();
    }
  }
  
  
  async function confirmPayment(accepted: number[], denied: number[]) {
    const client = Client.forTestnet(); // or Mainnet
  
    const operatorPrivateKey = PrivateKey.fromString('your_private_key');
    const operatorAccountId = 'your_operator_account_id';
    client.setOperator(operatorAccountId, operatorPrivateKey);
  
    const contractId = ContractId.fromString('your_contract_id');
  
    try {
      const confirmPaymentTx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunction('confirmPayment', { accepted, denied })
        .execute(client);
  
      const confirmPaymentReceipt = await confirmPaymentTx.getReceipt(client);
      if (confirmPaymentReceipt.status === Status.Success) {
        console.log('Payment confirmed successfully');
      } else {
        console.error('Failed to confirm payment');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      client.close();
    }
  }
  
  // Call the individual functions as needed
  // insertDevices(['device1', 'device2']);
  // issuePayment('recipient_address', 123, 100000);
  // retrievePendingIds();
  // confirmPayment([1, 2], [3, 4]);
  