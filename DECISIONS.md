# DECISIONS.md — SkillSwap

## DP1 · Rejection
What a client can see/do after a creator declines: the booking's status updates
to "Declined" wherever the client looks it up (booking reference code or
email on `/my-bookings`), and the creator's optional one-line decline reason is
shown alongside it. No refund/credit logic runs, since SkillSwap doesn't take
payment at booking time — booking a gig is a request, not a transaction. The
client is shown a "Browse similar gigs" link back to that category. This keeps
the loop closed and honest without needing any payment/refund system.

## DP2 · Double booking
A gig CAN accept a new booking request while another is still Pending. Gigs
represent an open service listing, not a fixed calendar slot — a designer
offering "Logo Design" can reasonably field several inbound briefs at once
and choose which to accept from their dashboard. Blocking new requests the
moment one is pending would hide real demand from creators and doesn't match
how gig marketplaces (Fiverr, Upwork) behave. Capacity is managed manually by
the creator accepting/declining, not automatically by the system.

## DP3 · Discovery
Gigs are ranked "Newest first" by default on the marketplace page, with a
toggle for Price (low→high) and Rating. Newest-first was chosen over
cheapest/rating-first because this is a creator-economy platform for *young*
creators — defaulting to price or rating would bury every new creator's
first listing under established ones. Newest keeps discovery fair while the
sort toggle still lets clients optimize for budget when they want to.
