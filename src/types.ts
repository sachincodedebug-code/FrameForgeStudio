export type FilmStatus = 'draft' | 'published';
export type AccessType = 'free' | 'rent' | 'buy';
export interface Film { id:string; title:string; description:string; synopsis?:string; genre:string; genres?:string[]; runtime:number; duration?:number; thumbnail?:string; posterUrl:string|null; trailerUrl:string|null; videoUrl?:string; price:number; ticketPrice?:number; currency?:string; accessType?:AccessType; status?:FilmStatus; deadlineAt?:string|null; featured?:boolean; createdAt:string|number; director?:string; tagline?:string; releaseYear?:number; rating?:string; laurels?:string[]; }
export interface Order { id:string; amount:number; currency:string; paymentStatus:'pending'|'paid'|'failed'|'refunded'; createdAt:string; film:Pick<Film,'id'|'title'|'posterUrl'|'runtime'|'genre'>|null; }
export interface AdminPaymentConfig { qrCodeUrl:string; paymentHandle:string; accountName:string; paymentInstructions:string; currencySymbol:string; }
export interface PurchaseRecord { id:string; filmId:string; filmTitle:string; thumbnail:string; runtime:number; genre:string; pricePaid:number; purchaseDate:string; transactionRef:string; buyerName:string; buyerEmail?:string; }
