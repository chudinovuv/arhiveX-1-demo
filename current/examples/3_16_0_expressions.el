###############################################################################
#  Copyright (c) 2026 Yurii Chudinov. All rights reserved.                    #
#                                                                             #
#  File:        specifications/v1.0/examples/3_10_0_variable.el               #
#  Description: Examples of expressions and operators — comparison, logical,  #
#               mathematical, brackets and precedence                         #
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
domain "Expression Examples"
    version: "1.0.0"
    runtime: .net
    runver: "8.0"
    platform: x64
    cross-border: sanitize
    explained as "Demonstrates all expression and operator forms from §3.16";



    # ── Definitions (enforcement invariant targets) ──

    define definition "Access Control"
        version: "1.0.0"
    explained as "Policy governing resource access authorization and permission checks."
    end;

    define definition "Eligibility"
        version: "1.0.0"
    explained as "Policy governing eligibility criteria evaluation and decision rules."
    end;

    define definition "Order Processing"
        version: "1.0.0"
    explained as "Policy governing order processing workflow, validation, and state transitions."
    end;

    # =========================================================================
    # §3.16.1 — Comparison operators
    # =========================================================================

    define rule "access-level" (user: User, resource: Resource)
        explained as "Demonstrates is, is not, in, not in, <, >=, == operators."

        # is / is not (semantic equality / inequality)
        infer "Owner" when
            user.Id is resource.OwnerId

        infer "Denied" when
            user.Status is not "Active"

        # in / not in (collection membership)
        infer "Collaborator" when
            user.Id in resource.Collaborators and
            user.Role is not "Guest"

        infer "Excluded" when
            user.Id not in resource.AllowedUsers

        # <, <=, >, >= (ordering)
        infer "Senior" when
            user.Experience >= 10 and
            user.Age > 30

        infer "Junior" when
            user.Experience < 2

        default infer "Standard"
    end enforces ["Access Control"];


    # =========================================================================
    # §3.16.2 — Logical operators (and, or, not, xor)
    # =========================================================================

    define rule "eligibility-check" (applicant: Applicant)
        explained as "Demonstrates and, or, not, and short-circuit evaluation."

        # and — both conditions must hold
        infer "Fully Eligible" when
            applicant.Age >= 18 and
            applicant.Income >= 30000.0 and
            applicant.CreditScore >= 700

        # or — at least one condition
        infer "Partially Eligible" when
            applicant.HasGuarantor or
            applicant.CollateralValue > 50000.0

        # not — negation
        infer "Blocked" when
            not applicant.IsVerified

        # combined and / or / not
        infer "Review Required" when
            (applicant.Age >= 18 and applicant.Income >= 20000.0) and
            (not applicant.IsVerified or applicant.CreditScore < 600)

        default infer "Ineligible";
    end enforces ["Eligibility"];


    # xor in method context
    define method CheckExclusiveFlags(flagA: bool, flagB: bool): string
        explained as "xor — exclusive OR: exactly one must be true."

        if flagA xor flagB:
            return "Exactly one flag is set";
        end
        return "Both or neither set";
    end;


    # =========================================================================
    # §3.16.3 — Mathematical operators (+, -, *, /, mod)
    # =========================================================================

    define method CalculateOrder(
        unitPrice: decimal,
        quantity: int,
        taxRate: decimal,
        discount: decimal
    ): OrderCalculation
        explained as "Arithmetic: +, -, *, / on decimal and int."

        let subtotal = unitPrice * quantity;
        let discountAmount = subtotal * discount;
        let afterDiscount = subtotal - discountAmount;
        let taxAmount = afterDiscount * taxRate;
        let total = afterDiscount + taxAmount;

        return new OrderCalculation(
            .Subtotal: subtotal,
            .Discount: discountAmount,
            .Tax: taxAmount,
            .Total: total
        );
    end;

    # mod (modulo / remainder)
    define method IsLeapYear(year: int): bool
        explained as "Modulo operator for divisibility checks."

        if year mod 400 == 0:
            return true;
        end
        if year mod 100 == 0:
            return false;
        end
        if year mod 4 == 0:
            return true;
        end
        return false;
    end;

    # String concatenation with +
    define method BuildGreeting(firstName: string, lastName: string, title: string): string
        explained as "+ on strings performs concatenation."

        return title + " " + firstName + " " + lastName;
    end;

    # Unary negation
    define method Negate(value: double): double
        return -value;
    end;


    # =========================================================================
    # §3.16.4 — Brackets and precedence
    # =========================================================================

    define method PrecedenceDemo(a: int, b: int, c: int, d: int): int
        explained as "Parentheses override default operator precedence."

        # Without parentheses: * binds tighter than +
        let result1 = a + b * c;          # a + (b * c)

        # With parentheses: addition first
        let result2 = (a + b) * c;        # (a + b) * c

        # Complex nested precedence
        let result3 = (a + b) * (c - d);

        return result3;
    end;

    define rule "complex-condition" (order: Order)
        explained as "Precedence: not > and > xor > or. Parentheses clarify intent."

        # not has highest logical precedence
        infer "Flagged" when
            not order.IsVerified and order.Total > 10000.0

        # Parentheses clarify grouping
        infer "Expedite" when
            (order.Priority is "High" or order.Priority is "Critical") and
            order.Items.Count > 0 and
            not order.OnHold

        # Comparison before logical
        infer "Large Order" when
            order.Items.Count >= 50 and
            order.Total >= 100000.0

        default infer "Normal";
    end enforces ["Order Processing"];


    # =========================================================================
    # Combined: all operator families in one method
    # (foreach/if/mutation forbidden in action — §2.6.5.4.1 B; shown in method)
    # =========================================================================

    define method ScoreAndClassify(
        student: Student,
        examScores: array of int
    ): ClassificationResult
        explained as "Combines comparison, logical, and math operators."

        if student.Status is not "Enrolled":
            throw "Student must be enrolled.";
        end

        if examScores.Count == 0:
            throw "Scores must not be empty.";
        end

        # Math: compute average
        let total = 0;
        foreach score in examScores:
            total = total + score;
        end
        let average = total / examScores.Count;

        # Math: compute max delta
        let maxScore = 0;
        let minScore = 100;
        foreach score in examScores:
            if score > maxScore:
                maxScore = score;
            end
            if score < minScore:
                minScore = score;
            end
        end
        let delta = maxScore - minScore;

        # Comparison + logical: classify
        let grade = "";
        if average >= 90 and delta <= 20:
            grade = "A — Consistent Excellence";
        else if average >= 75 or (average >= 60 and not student.HasWarnings):
            grade = "B — Good Standing";
        else:
            grade = "C — Needs Improvement";
        end

        return new ClassificationResult(
            .StudentId: student.Id,
            .Average: average,
            .Grade: grade,
            .ScoreRange: delta,
            .ExamCount: examScores.Count
        );
    end;

end;
