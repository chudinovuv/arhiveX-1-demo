# Final: Q18 — B-008 (B-008)

## Question
What are the block type compatibility rules in E.L.I.A. — can block types be assigned to each other?

## Answer

Based on my search results, here is what I found about block type compatibility rules in E.L.I.A.:

## Block Type Compatibility Rules

The specification indicates there **are** explicit compatibility rules governing block type assignment and interaction. While I located the relevant section (§2.7.2.0.2 — "Types Compatibility"), the full details were not accessible in my current search results due to file resolution issues.

However, from the search results, I can confirm:

1. **Block Types Have Defined Compatibility** (§2.2.0.2 — Normative Properties):
   - Each block type **MUST belong to a block class** that explicitly defines its properties
   - Block classes establish the enforcement boundary where physical constraints become semantically observable

2. **Compatibility is Type-Based**:
   - The specification includes a dedicated section on "Types Compatibility" (§2.7.2.0.2) in the Data Interface chapter, indicating that block types participate in a formal type compatibility system
   - This is related to broader type system design (§2.0.6 on Inline-declared Types)

3. **Assignment Rules May Have Constraints**:
   - Related work on "Limited LSP (Liskov Substitution Principle)" (§8.1.5.1) suggests there are constraints on type substitution and assignment, though these may apply more broadly than just blocks

4. **Semantic Role**:
   - Block types act as "atomic physical truth carriers" (§2.2.0.3), which means compatibility rules likely enforce strict structural requirements to preserve immutability and determinism

**To get the complete compatibility rules**, you should directly read §2.7.2.0.2 and the surrounding sections in `2_7_2_data_interface.md` for the normative requirements on block type assignment and substitution.
