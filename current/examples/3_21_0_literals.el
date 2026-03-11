###############################################################################
#  Copyright: 2026 AI Actor LLC, all rights reserved                          #
#  License: MIT License                                                       #
#  File: specifications/v1.0/examples/3_21_0_literals.el                      #
#  License: Advanced Creative Commons Attribution 4.0 International License   #
#  Description: Examples of value literals — integer, float, decimal, bool,   #
#               string, null, guid, riid, datetime, enum, tuple, array, dict  #
###############################################################################


domain "Value Literal Examples"
    version: "1.0.0"
    runtime: .net
    runver: "8.0"
    platform: x64

    explained as """
        Demonstrates all literal forms defined in §3.21.
        Each section maps to a subsection of §3.21 Value Literals.
    """



    # ── Definitions (enforcement invariant targets) ──

    define definition "Value Literal Showcase"
        version: "1.0.0"
    explained as "Definition governing supported value literal formats and parsing rules."
    end;

    # ===================================================================
    # §3.21.1 — Integer Literals
    # ===================================================================

    define method IntegerLiterals(): void
        # Decimal integers
        let count: int32 = 42;
        let negative: int32 = -100;
        let big: int64 = 9_223_372_036_854_775_807;

        # Hexadecimal integers
        let mask: uint32 = 0xFF_00_FF_00;
        let colorRed: uint32 = 0xFF0000;
        let header: uint16 = 0xBEEF;

        # Binary integers
        let flags: uint8 = 0b1010_0011;
        let permission: uint8 = 0b0000_1111;
        let pattern: uint16 = 0b1100_1100_1010_0101;

        # Underscore separators for readability
        let million: int32 = 1_000_000;
        let kilo: int32 = 1_024;

        print "Integer literals OK";
    end


    # ===================================================================
    # §3.21.2 — Floating-Point and Decimal Literals
    # ===================================================================

    define method FloatingPointLiterals(): void
        # Decimal (exact base-10, financial-grade)
        let price: decimal = 19.99m;
        let balance: decimal = 1_000_000.50;
        let tax: decimal = 0.21m;

        # Float (IEEE-754 binary32)
        let threshold: float = 0.7f;
        let pi32: float = 3.14159f;

        # Double (IEEE-754 binary64)
        let ratio: double = 3.141_592_653_589d;
        let scientific: double = 1.23e10d;
        let tiny: double = 6.02e-23d;

        # Default: fractional without suffix → decimal
        let amount: decimal = 99.95;

        print "Floating-point literals OK";
    end


    # ===================================================================
    # §3.21.3 — Boolean Literals
    # ===================================================================

    define method BooleanLiterals(): void
        let isActive: bool = true;
        let hasFailed: bool = false;

        # No implicit coercion from int
        # let wrong: bool = 0;   ← compile-time error
        # let wrong: bool = 1;   ← compile-time error

        print "Boolean literals OK";
    end


    # ===================================================================
    # §3.21.4 — String Literals
    # ===================================================================

    define method StringLiterals(): void
        # Simple string
        let greeting: string = "Hello, World!";

        # Escape sequences
        let path: string = "C:\\Users\\data\\file.txt";
        let multiLine: string = "Line 1\nLine 2\tTabbed";
        let quoted: string = "She said \"hello\"";
        let nullChar: string = "end\0here";
        let unicode: string = "Copyright: \u00A9";

        # Multiline block string (triple quotes)
        let description: string = """
            This is a multiline string block.
            It preserves line breaks and indentation.
            No escape sequences needed for quotes: "like this".
        """;

        let sql: string = """
            SELECT u.Name, u.Email
            FROM Users u
            WHERE u.Status = 'active'
            ORDER BY u.Name ASC
        """;

        print "String literals OK";
    end


    # ===================================================================
    # §3.21.5 — Null and Special Literals
    # ===================================================================

    define method NullLiterals(): void
        let result: string = null;
        let data: Record = null;

        # `nothing` — semantic non-applicability (definition/explanation contexts)
        # `void` — return type marker only, not a value

        print "Null literals OK";
    end


    # ===================================================================
    # §3.21.6 — GUID and RIID Literals
    # ===================================================================

    define method GuidLiterals(): void
        # GUID literal (RFC 4122 format)
        let entityId: guid = {550e8400-e29b-41d4-a716-446655440000};
        let sessionId: guid = {6ba7b810-9dad-11d1-80b4-00c04fd430c8};

        # RIID literal (E.L.I.A. 96-bit format)
        let runtimeId: riid = {a1b2c3d4-e5f6-78901234-abcd};

        # Runtime GUID generation (not a literal — produces new value)
        let newId: guid = guid.new();

        print "GUID/RIID literals OK";
    end


    # ===================================================================
    # §3.21.7 — Date/Time Literals
    # ===================================================================

    define method DateTimeLiterals(): void
        # Date only
        let birthday: date = #2025-01-15#;
        let epoch: date = #1970-01-01#;

        # Time only
        let alarm: time = #h08m00#;
        let noon: time = #h12m00s00#;
        let precise: time = #h14m30s15.500#;

        # Timestamp (date + time)
        let meeting: timestamp = #2025-01-15h14m30s00#;
        let midnight: timestamp = #2025-12-31h23m59s59#;

        # Timespan (duration)
        let timeout: timespan = #0d0h5m30s#;
        let twoAndHalf: timespan = #2d12h#;
        let shortWait: timespan = #0h0m30s#;
        let precise_span: timespan = #1d6h30m15s.250#;

        # Constructor form (ISO 8601 / RFC 3339 string)
        let fromString: timestamp = datetime("2025-01-15T14:30:00Z");

        print "Date/Time literals OK";
    end


    # ===================================================================
    # §3.21.8 — Enum Literals
    # ===================================================================

    define enum OrderStatus (Pending, Confirmed, Shipped, Delivered, Cancelled);

    define enum LogLevel (Debug = 0, Info = 1, Warning = 2, Error = 3, Critical = 4);

    define method EnumLiterals(): void
        # Always fully qualified: EnumType.Member
        let status: OrderStatus = OrderStatus.Pending;
        let severity: LogLevel = LogLevel.Warning;

        # Enum in conditions
        if status is OrderStatus.Cancelled:
            print "Order was cancelled";
        end

        # Enum in anyof
        if severity anyof [LogLevel.Error, LogLevel.Critical]:
            print "High severity event";
        end

        print "Enum literals OK";
    end


    # ===================================================================
    # §3.21.9 — Tuple Literals
    # ===================================================================

    define method TupleLiterals(): void
        # Two-element tuple
        let pair: tuple[int, string] = (.1: 42, .2: "answer");

        # Three-element tuple
        let triple: tuple[int, string, bool] = (.1: 1, .2: "example", .3: true);

        # Accessing tuple fields
        let id: int = pair.1;
        let label: string = pair.2;

        # Tuple with complex types
        let composite: tuple[guid, date, decimal] = (
            .1: {550e8400-e29b-41d4-a716-446655440000},
            .2: #2025-06-15#,
            .3: 1500.00m
        );

        print "Tuple literals OK";
    end


    # ===================================================================
    # §3.21.10 — Array Initializers
    # ===================================================================

    define method ArrayInitializers(): void
        # Inline 1D array (bracket syntax)
        let numbers: array of int = [1, 2, 3, 4, 5];
        let names: array of string = ["Alice", "Bob", "Charlie"];

        # Trailing comma is OK
        let tags: array of string = [
            "urgent",
            "reviewed",
            "approved",
        ];

        # Constructor form — allocate with dimensions
        let buffer: array of int = new array of int(100);
        let matrix: array[,] of double = new array[,] of double(3, 4);
        let cube: array[,,] of int = new array[,,] of int(10, 10, 10);

        # Empty array
        let empty: array of string = new array of string(0);

        print "Array initializers OK";
    end


    # ===================================================================
    # §3.21.11 — Dictionary Initializers
    # ===================================================================

    define method DictionaryInitializers(): void
        # String-keyed dictionary
        let lookup: dictionary[string, int] = new dictionary[string, int](
            "alpha": 1,
            "beta": 2,
            "gamma": 3,
        );

        # Integer-keyed dictionary
        let codeMap: dictionary[int, string] = new dictionary[int, string](
            200: "OK",
            404: "Not Found",
            500: "Internal Server Error",
        );

        # GUID-keyed dictionary
        let entities: dictionary[guid, string] = new dictionary[guid, string](
            {550e8400-e29b-41d4-a716-446655440000}: "EntityAlpha",
            {6ba7b810-9dad-11d1-80b4-00c04fd430c8}: "EntityBeta",
        );

        # Enum-keyed dictionary
        let labels: dictionary[OrderStatus, string] = new dictionary[OrderStatus, string](
            OrderStatus.Pending: "Awaiting confirmation",
            OrderStatus.Shipped: "In transit",
            OrderStatus.Delivered: "Complete",
        );

        # Empty dictionary
        let cache: dictionary[string, int] = new dictionary[string, int]();

        print "Dictionary initializers OK";
    end


    # ===================================================================
    # Combined example: all literal types in a single action
    # ===================================================================

    define record LiteralShowcase
        property Count: int32;
        property Price: decimal;
        property IsActive: bool;
        property Label: string;
        property Id: guid;
        property Created: timestamp;
        property Status: OrderStatus;
    end

    define action "demonstrate-all-literals"(): LiteralShowcase
        let showcase = new LiteralShowcase(
            .Count: 0xFF,
            .Price: 49.99m,
            .IsActive: true,
            .Label: "showcase-item",
            .Id: {a1b2c3d4-e5f6-7890-abcd-ef1234567890},
            .Created: #2025-06-15h10m30s00#,
            .Status: OrderStatus.Confirmed
        );

        return showcase;
    end enforced ["Value Literal Showcase"];

end
