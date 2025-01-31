;; Define NFT token
(define-non-fungible-token starmint uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-not-owner (err u102))

;; Data vars
(define-data-var token-count uint u0)
(define-map token-metadata 
  uint 
  {
    name: (string-utf8 256),
    description: (string-utf8 1024),
    milestone-date: uint,
    verified: bool
  }
)

;; Mint new NFT
(define-public (mint (recipient principal) (name (string-utf8 256)) (description (string-utf8 1024)) (milestone-date uint))
  (let
    (
      (token-id (var-get token-count))
    )
    (try! (nft-mint? starmint token-id recipient))
    (map-set token-metadata token-id {
      name: name,
      description: description,
      milestone-date: milestone-date,
      verified: false
    })
    (var-set token-count (+ token-id u1))
    (ok token-id)
  )
)

;; Transfer NFT
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (try! (nft-transfer? starmint token-id sender recipient))
    (ok true)
  )
)

;; Verify milestone (owner only)
(define-public (verify-milestone (token-id uint))
  (let 
    (
      (metadata (unwrap! (map-get? token-metadata token-id) (err err-not-found)))
    )
    (asserts! (is-eq tx-sender contract-owner) (err err-owner-only))
    (map-set token-metadata token-id (merge metadata {verified: true}))
    (ok true)
  )
)

;; Read only functions
(define-read-only (get-token-uri (token-id uint))
  (ok (some "https://api.starmint.xyz/metadata/"))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? starmint token-id))
)

(define-read-only (get-milestone-details (token-id uint))
  (map-get? token-metadata token-id)
)

(define-read-only (get-token-count)
  (ok (var-get token-count))
)
