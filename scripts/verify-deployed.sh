set -e
set -o pipefail

TMPDIR="${TMPDIR:-"/tmp"}"
LOCAL_BINARY_PATH="target/verifiable/monkey_staking.so"
CLUSTER="${CLUSTER:-"devnet"}"

PROGRAM_ID=$1
[ -n "$PROGRAM_ID" ] || (echo "Missing PROGRAM_ID argument" && exit 1)

[ -f "$LOCAL_BINARY_PATH" ] || (echo "No such file: $LOCAL_BINARY_PATH" && exit 1)
LOCAL_BINARY_SIZE="$(wc -c "$LOCAL_BINARY_PATH" | awk '{ print $1}')"

trim_to_local_binary_size() {
    head -c "$LOCAL_BINARY_SIZE" "$1"
}

pad_with_zeros() {
    dd if=/dev/null of="$1" bs=1 count=0 seek=$2
}

sha() {
    shasum | cut -f1 -d" "
}

echo "Fetching binary for $PROGRAM_ID on $CLUSTER..."
solana program dump -u "$CLUSTER" "$PROGRAM_ID" "${TMPDIR}/deployed.so"
DEPLOYED_BINARY_PATH="${TMPDIR}/deployed.so"
DEPLOYED_SHA="$(cat "$DEPLOYED_BINARY_PATH" | sha)"
DEPLOYED_LENGTH="$(wc -c < "$DEPLOYED_BINARY_PATH")"

PADDED_LOCAL_BINARY_PATH="${TMPDIR}/local.so"
cp "$LOCAL_BINARY_PATH" "$PADDED_LOCAL_BINARY_PATH"
echo "Padding local binary with zeros to $DEPLOYED_LENGTH bytes"
pad_with_zeros "$PADDED_LOCAL_BINARY_PATH" $DEPLOYED_LENGTH
LOCAL_SHA="$(cat "$PADDED_LOCAL_BINARY_PATH" | sha)"
echo "Deployed SHA: $DEPLOYED_SHA"
echo "Local SHA:    $LOCAL_SHA"
echo -n "Match: "
[ "$LOCAL_SHA" == "$DEPLOYED_SHA" ] && echo "$(tput setaf 2)✔$(tput sgr0)" || echo "❌"
[ "$LOCAL_SHA" == "$DEPLOYED_SHA" ] && exit 0 || exit 2