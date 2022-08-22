set -e
set -o pipefail

[ -n "$MONKEY_STAKING_PROG_ID" ] || (>&2 echo "Missing MONKEY_STAKING_PROG_ID" && exit 1)
[ -n "$VERIFIABLE_PROGRAM_FILEPATH" ] || (>&2 echo "Missing VERIFIABLE_PROGRAM_FILEPATH" && exit 1)
[ -n "$CLUSTER" ] || (>&2 echo "Missing CLUSTER" && exit 1)
[ -n "$PAYER_KEYPAIR_PATH" ] || (>&2 echo "Missing PAYER_KEYPAIR_PATH" && exit 1)

if solana program show --url "$CLUSTER" $MONKEY_STAKING_PROG_ID ; then
  solana program deploy \
    --url "$CLUSTER" \
    --keypair "$PAYER_KEYPAIR_PATH" \
    --program-id "$MONKEY_STAKING_PROG_ID" \
    --skip-fee-check \
    "$VERIFIABLE_PROGRAM_FILEPATH"
else
  echo "$(tput setaf 2)Notice:$(tput sgr0) You need access to the program's seed phrase and passphrase"
  solana program deploy \
    --url "$CLUSTER" \
    --keypair "$PAYER_KEYPAIR_PATH" \
    --program-id ASK \
    "$VERIFIABLE_PROGRAM_FILEPATH"
fi