# Fractal Staking/DID contracts

Two main contracts are included:
* Staking
* ClaimsRegistry

## ClaimsRegistry

In conjunction with the browser plugin, this contract can be used to submit and
verify claims.

Each claim has a few properties:
* `subject`: Who the claim is about
* `issuer`: Who issued and signed the claim
* `claimHash`: A generic hash generatic by the browser. Allows verification of
    data without actually storing personal information
* `signature`: The signature, which must correspond to `hash([subject, claimHash])`

The expected flow is as follows:
* Plugin gathers all date and generates a root `claimHash`
* Plugin calls `registry.computeSignableKey(subjectAddress, rootHash)`, and
    receives a new hash, `signableHash` as a result
* Issuer's wallet signs `signableHash` and returns the signature to the plugin
* Plugin calls `registry.setClaimWithSignature(subject, issuer, rootHash,
    signature)`, which validates the signature against the subject, hash, and
    issuer, and stores it
* Further calls to `registry.getClaim(issuer, signature)` should return `subject`;


## Staking

A staking contract receives the following arguments:
* `_token`: Address of the ERC20 token to stake
* `_registry`: Address of the `ClaimsRegistry` contract
* `_issuer`: Address of the issuer to expect when verifying claims
* `_startDate`: Timestamp at which staking becomes possible
* `_endDate`: Timestamp at which staking is over
* `_individualMinimumAmount`: Minimum amount (in token subunits) required for each subscription
* `_cap`: Percentage (multiplied by 100) of the maximum reward each subscription can yield. A stake of 100 tokens with a 40 cap means the maximum reward is 40 tokens.

The expected flow is as follows:
* Once deployed, the desired pool of tokens must be transfered to the contract's
    address
* Once `startDate` is reached, staking becomes possible
* Rewards are calculated at the moment staking happens, but will be
    re-calculated if users withdraw earlier than `endDate`
* Rewards are calculated according to what was discussed on [this spreadsheet](https://docs.google.com/spreadsheets/d/1SgW1LuTldfKEVkbrpkI_7pcIUDeacjRYHsuJTkXOGJE/edit#gid=2055588626) (ask Miguel Palhas (miguel@subvisual.co) for access if needed)
* When a stake is created, the calculated maximum reward is locked
* If the calculated reward is larger than the remaining pool (not counting
    already locked tokens), stake is refused
* Plugin can query the contract to get the current pool availability, size of
    a particular stake, current reward, start/end dates, and calculate a reward
    for arbitrary numbers before issuing a stake
