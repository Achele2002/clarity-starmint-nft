import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can mint new NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;

    let block = chain.mineBlock([
      Tx.contractCall(
        "starmint",
        "mint",
        [
          types.principal(wallet1.address),
          types.utf8("First Achievement"),
          types.utf8("Completed important milestone"),
          types.uint(1635724800)
        ],
        deployer.address
      ),
    ]);
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    assertEquals(block.receipts[0].result, "(ok u0)");
  },
});

Clarinet.test({
  name: "Can transfer NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get("wallet_1")!;
    const wallet2 = accounts.get("wallet_2")!;

    // First mint NFT
    let block = chain.mineBlock([
      Tx.contractCall(
        "starmint",
        "mint",
        [
          types.principal(wallet1.address),
          types.utf8("Achievement"),
          types.utf8("Description"),
          types.uint(1635724800)
        ],
        wallet1.address
      ),
    ]);

    // Then transfer
    block = chain.mineBlock([
      Tx.contractCall(
        "starmint",
        "transfer",
        [
          types.uint(0),
          types.principal(wallet1.address),
          types.principal(wallet2.address)
        ],
        wallet1.address
      ),
    ]);
    
    assertEquals(block.receipts[0].result, "(ok true)");
  },
});

Clarinet.test({
  name: "Only owner can verify milestone",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;

    let block = chain.mineBlock([
      Tx.contractCall(
        "starmint",
        "verify-milestone",
        [types.uint(0)],
        wallet1.address
      ),
    ]);
    
    assertEquals(block.receipts[0].result, "(err u100)");
  },
});
