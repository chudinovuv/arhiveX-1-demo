###############################################################################
#  Copyright (c) 2026 Yurii Chudinov. All rights reserved.                    #
#                                                                             #
#  File:        specifications/v1.0/examples/3_10_0_variable.el               #
#  Description: Examples of variable declaration — let / var (§3.10)          #
#                                                                             #
#  This file is part of the ARC/SPO language specification and is provided    #
#  for reference and evaluation only. No license, express or implied, is      #
#  granted to use, copy, modify, distribute, sublicense, or create derivative #
#  works, in whole or in part, by any means.                                  #
#                                                                             #
#  Patent notice: subject matter disclosed in this file may be covered by     #
#  patent applications filed with INPI Portugal (incl. #120955, #120960) and  #
#  by deposits on Zenodo under the author's name. No patent license is        #
#  granted.                                                                   #
#                                                                             #
#  Contact: chudinovuv@proton.me                                              #
###############################################################################


domain "Variable Declaration Examples"
    version: "1.0.0"
    runtime: .net
    runver: "8.0"
    platform: x64
    explained as "Demonstrates variable declaration patterns";

    # =========================================================================
    # let — immutable binding (primary form)
    # =========================================================================

    define method CalculateOrderTotal(
        items: array of OrderItem,
        discountRate: decimal
    ): decimal

        # Simple value binding
        let count = items.Count;
        let subtotal = items.Sum(.Price * .Quantity);

        # Computed expression
        let discount = subtotal * discountRate;
        let total = subtotal - discount;

        # Delegate result — method MAY invoke delegates (INV-055, MTH-031)
        let taxRate = invoke GetTaxRate(.Region: "US");
        let tax = total * taxRate;

        return total + tax;
    end;


    # =========================================================================
    # let — type-annotated declarations
    # =========================================================================

    define method FormatReport(data: ReportData): string

        let title: string = data.Title;
        let count: int = data.Records.Count;
        let average: decimal = data.Records.Average(.Value);
        let generated: timestamp = now();

        return title + " (" + count.ToString() + " records, avg: " + average.ToString() + ")";
    end;


    # =========================================================================
    # let — binding from new (record construction)
    # =========================================================================

    define action "create-summary"(
        name: string,
        items: array of Item
    ): Summary
        explained as "Variable binding from new expression."

        # Block form
        let summary = new Summary()
            .Name = name;
            .ItemCount = items.Count;
            .Total = items.Sum(.Price);
            .CreatedAt = now();
        end;

        # Constructor-call form
        let meta = new Metadata(
            .Author: "system",
            .Version: "1.0",
            .Timestamp: now()
        );

        return summary;
    end;


    # =========================================================================
    # let — in rule (pure context, no mutation)
    # =========================================================================

    define rule "shipping-cost"(
        order: Order,
        destination: Address
    )
        # Variables in rule context — all immutable, all pure
        let weight = order.Items.Sum(.Weight);
        let distance = calculateDistance(order.Origin, destination);
        let baseRate = 0.5;

        infer "Free Shipping" when
            order.Total > 100.0 and
            distance < 500

        infer "Standard" when
            weight <= 10.0

        infer "Heavy" when
            weight > 10.0

        default infer "Standard";
    end;


    # =========================================================================
    # let — in binder (deterministic projection)
    # =========================================================================

    define binder ProjectCustomer(raw: RawCustomer): CustomerDTO
        let fullName = raw.FirstName + " " + raw.LastName;
        let isActive = raw.LastLoginDate >= (now() - days(90));

        .Name = fullName;
        .Email = raw.Email;
        .IsActive = isActive;
        .MemberSince = raw.RegistrationDate;
    end;


    # =========================================================================
    # let — collection binding and iteration context
    # =========================================================================

    define method ProcessDocuments(
        docs: array of Document
    ): array of ProcessResult

        let results = new array of ProcessResult();

        foreach doc in docs:
            let content = extractContent(doc);
            let wordCount = content.Split(" ").Count;
            let result = new ProcessResult(
                .DocId: doc.Id,
                .WordCount: wordCount,
                .Status: "Processed"
            );
            results.Add(result);
        end

        return results;
    end;

end
