export type KachingCashRegister = {
  "version": "0.1.0",
  "name": "kaching_cash_register",
  "instructions": [
    {
      "name": "createCashRegister",
      "accounts": [
        {
          "name": "cashier",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "cashRegister",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "consumedOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ixArgs",
          "type": {
            "defined": "CreateCashRegisterArgs"
          }
        }
      ]
    },
    {
      "name": "settleOrderPayment",
      "accounts": [
        {
          "name": "customer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "cashRegister",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "consumedOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructionsSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ixArgs",
          "type": {
            "defined": "SettleOrderPaymentArgs"
          }
        }
      ]
    },
    {
      "name": "createTokenCashbox",
      "accounts": [
        {
          "name": "cashier",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cashRegister",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenCashbox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ixArgs",
          "type": {
            "defined": "CreateTokenCashboxArgs"
          }
        }
      ]
    },
    {
      "name": "updateOrderSignersWhitelist",
      "accounts": [
        {
          "name": "cashier",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "cashRegister",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ixArgs",
          "type": {
            "defined": "UpdateOrderSignersWhitelistArgs"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "cashRegister",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cashRegisterId",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "cashier",
            "type": "publicKey"
          },
          {
            "name": "orderSignersWhitelist",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "consumedOrders",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "consumedOrders",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bytes",
            "type": {
              "array": [
                "u8",
                898600
              ]
            }
          },
          {
            "name": "kNum",
            "type": "u32"
          },
          {
            "name": "bitmapBitsNum",
            "type": "u64"
          },
          {
            "name": "sipKeys",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "OrderItem",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": "publicKey"
          },
          {
            "name": "op",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "FullOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u128"
          },
          {
            "name": "expiry",
            "type": "u32"
          },
          {
            "name": "customer",
            "type": "publicKey"
          },
          {
            "name": "notBefore",
            "type": "u32"
          },
          {
            "name": "createdAt",
            "type": "u32"
          },
          {
            "name": "cashRegisterId",
            "type": "string"
          },
          {
            "name": "items",
            "type": {
              "vec": {
                "defined": "OrderItem"
              }
            }
          }
        ]
      }
    },
    {
      "name": "CreateCashRegisterArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cashRegisterId",
            "type": "string"
          },
          {
            "name": "orderSignersWhitelist",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "consumedOrdersInitKNum",
            "type": "u32"
          },
          {
            "name": "consumedOrdersInitBitmapBitsNum",
            "type": "u64"
          },
          {
            "name": "consumedOrdersInitSipKeys",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "SettleOrderPaymentArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cashRegisterId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "CreateTokenCashboxArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMintKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "UpdateOrderSignersWhitelistArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderSignersWhitelist",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "mode",
            "type": {
              "defined": "OrderSignersUpdateType"
            }
          }
        ]
      }
    },
    {
      "name": "OrderSignersUpdateType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "MERGE"
          },
          {
            "name": "OVERRIDE"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CashRegisterIdInvalid",
      "msg": "cash_register_id is invalid, should be only ascii characters, of length 3-50"
    },
    {
      "code": 6001,
      "name": "CashRegisterOrderSignersWhilelistOverflow",
      "msg": "cash register can only have up to 5 order signers in whitelist"
    },
    {
      "code": 6002,
      "name": "UnknownOrderSigner",
      "msg": "order was not signed by a known order signers"
    },
    {
      "code": 6003,
      "name": "OrderCashRegisterIdMismatch",
      "msg": "cash_register_id in order does not match the cash register provided in instruction"
    },
    {
      "code": 6004,
      "name": "OrderCustomerMismatch",
      "msg": "tx signer does not match customer registered in order"
    },
    {
      "code": 6005,
      "name": "OrderExpired",
      "msg": "order is expired"
    },
    {
      "code": 6006,
      "name": "OrderNotValidYet",
      "msg": "order is not valid yet"
    },
    {
      "code": 6007,
      "name": "OrderItemAtaMissing",
      "msg": "order item associated token account was not found in instruction accounts"
    },
    {
      "code": 6008,
      "name": "OrderItemUnknownOperation",
      "msg": "order item operation is unknown (not 0 or 1)"
    },
    {
      "code": 6009,
      "name": "SignerIsNotCashRegisterAuthorized",
      "msg": "instruction signer does not match cash register owner"
    },
    {
      "code": 6010,
      "name": "ConsumedOrderAccountMismatch",
      "msg": "consumed_orders account does not match consumed_orders listed in cash register"
    },
    {
      "code": 6011,
      "name": "OrderHasBeenConsumed",
      "msg": "order has been consumed already"
    }
  ]
};

export const IDL: KachingCashRegister = {
  "version": "0.1.0",
  "name": "kaching_cash_register",
  "instructions": [
    {
      "name": "createCashRegister",
      "accounts": [
        {
          "name": "cashier",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "cashRegister",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "consumedOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ixArgs",
          "type": {
            "defined": "CreateCashRegisterArgs"
          }
        }
      ]
    },
    {
      "name": "settleOrderPayment",
      "accounts": [
        {
          "name": "customer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "cashRegister",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "consumedOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructionsSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ixArgs",
          "type": {
            "defined": "SettleOrderPaymentArgs"
          }
        }
      ]
    },
    {
      "name": "createTokenCashbox",
      "accounts": [
        {
          "name": "cashier",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cashRegister",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenCashbox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ixArgs",
          "type": {
            "defined": "CreateTokenCashboxArgs"
          }
        }
      ]
    },
    {
      "name": "updateOrderSignersWhitelist",
      "accounts": [
        {
          "name": "cashier",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "cashRegister",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ixArgs",
          "type": {
            "defined": "UpdateOrderSignersWhitelistArgs"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "cashRegister",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cashRegisterId",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "cashier",
            "type": "publicKey"
          },
          {
            "name": "orderSignersWhitelist",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "consumedOrders",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "consumedOrders",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bytes",
            "type": {
              "array": [
                "u8",
                898600
              ]
            }
          },
          {
            "name": "kNum",
            "type": "u32"
          },
          {
            "name": "bitmapBitsNum",
            "type": "u64"
          },
          {
            "name": "sipKeys",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "OrderItem",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": "publicKey"
          },
          {
            "name": "op",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "FullOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u128"
          },
          {
            "name": "expiry",
            "type": "u32"
          },
          {
            "name": "customer",
            "type": "publicKey"
          },
          {
            "name": "notBefore",
            "type": "u32"
          },
          {
            "name": "createdAt",
            "type": "u32"
          },
          {
            "name": "cashRegisterId",
            "type": "string"
          },
          {
            "name": "items",
            "type": {
              "vec": {
                "defined": "OrderItem"
              }
            }
          }
        ]
      }
    },
    {
      "name": "CreateCashRegisterArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cashRegisterId",
            "type": "string"
          },
          {
            "name": "orderSignersWhitelist",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "consumedOrdersInitKNum",
            "type": "u32"
          },
          {
            "name": "consumedOrdersInitBitmapBitsNum",
            "type": "u64"
          },
          {
            "name": "consumedOrdersInitSipKeys",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "SettleOrderPaymentArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cashRegisterId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "CreateTokenCashboxArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMintKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "UpdateOrderSignersWhitelistArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderSignersWhitelist",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "mode",
            "type": {
              "defined": "OrderSignersUpdateType"
            }
          }
        ]
      }
    },
    {
      "name": "OrderSignersUpdateType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "MERGE"
          },
          {
            "name": "OVERRIDE"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CashRegisterIdInvalid",
      "msg": "cash_register_id is invalid, should be only ascii characters, of length 3-50"
    },
    {
      "code": 6001,
      "name": "CashRegisterOrderSignersWhilelistOverflow",
      "msg": "cash register can only have up to 5 order signers in whitelist"
    },
    {
      "code": 6002,
      "name": "UnknownOrderSigner",
      "msg": "order was not signed by a known order signers"
    },
    {
      "code": 6003,
      "name": "OrderCashRegisterIdMismatch",
      "msg": "cash_register_id in order does not match the cash register provided in instruction"
    },
    {
      "code": 6004,
      "name": "OrderCustomerMismatch",
      "msg": "tx signer does not match customer registered in order"
    },
    {
      "code": 6005,
      "name": "OrderExpired",
      "msg": "order is expired"
    },
    {
      "code": 6006,
      "name": "OrderNotValidYet",
      "msg": "order is not valid yet"
    },
    {
      "code": 6007,
      "name": "OrderItemAtaMissing",
      "msg": "order item associated token account was not found in instruction accounts"
    },
    {
      "code": 6008,
      "name": "OrderItemUnknownOperation",
      "msg": "order item operation is unknown (not 0 or 1)"
    },
    {
      "code": 6009,
      "name": "SignerIsNotCashRegisterAuthorized",
      "msg": "instruction signer does not match cash register owner"
    },
    {
      "code": 6010,
      "name": "ConsumedOrderAccountMismatch",
      "msg": "consumed_orders account does not match consumed_orders listed in cash register"
    },
    {
      "code": 6011,
      "name": "OrderHasBeenConsumed",
      "msg": "order has been consumed already"
    }
  ]
};