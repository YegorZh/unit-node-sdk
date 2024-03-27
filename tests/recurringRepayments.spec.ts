import { CreateRecurringAchRepaymentRequest, CreateRecurringBookRepaymentRequest, CreateRecurringCapitalPartnerAchRepaymentRequest, CreateRecurringCapitalPartnerBookRepaymentRequest } from "../types/recurringRepayments"
import { Unit } from "../unit"
import { initRepaymentRelatedRelationships } from "./testHelpers"
import dotenv from "dotenv"

dotenv.config()
const unit = new Unit(process.env.UNIT_TOKEN || "test", process.env.UNIT_API_URL || "test")
const repaymentsId: string[] = []

describe("Create RecurringAchRepayment", () => {
    test("create recurringachrepayment", async () => {
        const data = await initRepaymentRelatedRelationships(unit)
        const req: CreateRecurringAchRepaymentRequest = {
            "type": "recurringAchRepayment",
            "attributes": {
                "description": "Rent"
            },
            "relationships": {
                "account": {
                    "data": {
                        "type": "depositAccount",
                        "id": data.depositAccountId
                    }
                },
                "counterparty": {
                    "data": {
                        "type": "counterparty",
                        "id": data.plaidCounterpartyId
                    }
                },
                creditAccount: {
                    data: {
                        type: "creditAccount",
                        id: data.nonPartnerCreditAccountId
                }
            }
        }
    }

        const res = await unit.recurringRepayments.create(req)
        expect(res.data.type === "recurringAchRepayment").toBeTruthy()
    })
})

describe("Create RecurringBookRepayment", () => {
    test("create recurringbookrepayment", async () => {
        const data = await initRepaymentRelatedRelationships(unit)
        const req: CreateRecurringBookRepaymentRequest = {
            "type": "recurringBookRepayment",
            "attributes": {
                "description": "Rent"
            },
            "relationships": {
                "account": {
                    "data": {
                        "type": "depositAccount",
                        "id": data.depositAccountId
                    }
                },
                "counterpartyAccount": {
                    "data": {
                        "type": "depositAccount",
                        "id": data.plaidCounterpartyId
                    }
                },
                creditAccount: {
                    data: {
                        type: "creditAccount",
                        id: data.nonPartnerCreditAccountId
                }
            }
        }
    }

        const res = await unit.recurringRepayments.create(req)
        expect(res.data.type === "recurringBookRepayment").toBeTruthy()
    })
})

describe("Create CapitalPartnerRecurringAchRepayment", () => {
    test("create recurringachaepayment", async () => {
        const data = await initRepaymentRelatedRelationships(unit)
        const req: CreateRecurringCapitalPartnerAchRepaymentRequest = {
            "type": "recurringCapitalPartnerAchRepayment",
            "attributes": {
                "description": "Rent",
                "addenda": "Test addenda"
            },
            "relationships": {
                "counterparty": {
                    "data": {
                        "type": "counterparty",
                        "id": data.plaidCounterpartyId
                    }
                },
                creditAccount: {
                    data: {
                        type: "creditAccount",
                        id: data.partnerCreditAccountId
                }
            }
        }
    }

        const res = await unit.recurringRepayments.create(req)
        expect(res.data.type === "recurringCaptialPartnerAchRepayment").toBeTruthy()
    })
})

describe("Create CapitalPartnerRecurringBookRepayment", () => {
    test("create capitalpartnerbookrepayment", async () => {
        const data = await initRepaymentRelatedRelationships(unit)
        const req: CreateRecurringCapitalPartnerBookRepaymentRequest = 
        {
            "type": "recurringCapitalPartnerBookRepayment",
            "attributes": {
                "description": "Rent",
            },
            "relationships": {
                "counterpartyAccount": {
                    "data": {
                        "type": "depositAccount",
                        "id": data.plaidCounterpartyId
                    }
                },
                creditAccount: {
                    data: {
                        type: "creditAccount",
                        id: data.partnerCreditAccountId
                    }
                }
            }
        }

        const res = await unit.recurringRepayments.create(req)
        expect(res.data.type === "recurringCapitalPartnerBookRepayment").toBeTruthy()
    })
})

describe("Repayments List", () => {
    test("get recurring repayments List", async () => {
        const res = await unit.recurringRepayments.list()
        res.data.forEach(element => {
            expect(element.type).toContain("Repayment")
            repaymentsId.push(element.id)
        })
    })
})

describe("Get Repayment Test", () => {
    test("get each recurring repayment", async () => {
        const repayments = (await unit.repayments.list()).data
        repayments.forEach(async rp => {
            const res = await unit.repayments.get(rp.id)
            expect(res.data.type).toContain("Repayment")
        })
    })
})

describe("Disable And Enable Recurring Repayment", () => {
    test("disable recurring repayment", async () => {
        const res = await unit.recurringRepayments.disable(repaymentsId[0])
        expect(res.data.attributes.status).toBe("Disabled")
    })

    test("enable recurring repayment", async () => {
        const res = await unit.recurringRepayments.enable(repaymentsId[0])
        expect(res.data.attributes.status).toBe("Active")
    })
})