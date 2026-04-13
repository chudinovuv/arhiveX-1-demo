###############################################################################
#  Copyright (c) 2026 Yurii Chudinov. All rights reserved.                    #
#                                                                             #
#  File: specifications/v0.9/examples/1_1_1_domain.el                         #
#  Description: Example of delegates definitions inside domain declaration    #
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

# Comlete example of domain declaration with imports and delegates
define domain "SDLC-IT-Company"
    version: "1.0.0"
    runtime: .net
    runver: "6.0"
    platform: x64
    cross-border: sanitize|encrypt
    explained as "module for software design concepts and specifications";
    # Shortcut for using .NET libraries bcause inside module scope by defautl
    using library "net-fs" as "System.IO.FileSystem, Version=6.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a";
    
    # full syntax for using .NET libraries with calling convention native
    using library "net-fs" as "System.IO.FileSystem"
        via native;
    
    # full syntax for using .NET libraries with calling convention stdcall
    using library "w-shell" as "Microsoft.WindowsAPICodePack.Shell"
        via platform,
        options: (
            .calling_convention: stdcall
        );


    # ── Definitions (enforcement invariant targets) ──

    define definition "Basic File Attributes"
        version: "1.0.0"
    explained as "Definition of basic file attribute set: name, size, created, modified."
    end;

    # some imports declaratios here
    # ... omitted for brevity ...
    # somer  semantic interface declarations here...
    # ... omitted for brevity ...
    # some definitions here...
    # ... omitted for brevity ...
    # some rules here...
    # ... omitted for brevity ...

    # some records and type definitions here..
    define public record ExtFileInfo
        property Author: string;
        property Title: string;
        property Subject: string;
        property Keywords: array of string;
    end enforced ["Basic File Attributes"];


    # some delegates here...

    end


    
# Minimal example of domain declaration with imports and delegates
domain "Electronic document processing"
    version: "1.0.0"
    runtime: .net
    runver: "6.0"
    platform: x64
    cross-border: sanitize|encrypt
explained as "
    Module for processing electronic documents within organizational workflows.";    

    export semantic interface "Electronic Document Processing"
        explained as "Provides rules and definitions for processing electronic documents."        
        
        by definition "Document Action Flow"
    end

    # definitions -----
  definition "Document Action Flow"
     version: "1.0.0"
     effective_date: "2024-11-15"
     deprecated_date null
 explained as "
     A sequence of actions taken by persons on a document within a process flow.
     Each action is recorded with the responsible person, action type, timestamp, and organizational role.
     "
 constraints[
    must: [ 
        "Include Valid Person",
        "Specify Action Type",
        "Record Timestamp of Action",
        "Define Organizational Role of Actor",
        "At least one review action present",
        "Only one approve action allowed",
    ]
    should: [
        "Actions are ordered logically by review then approval sequence",
        "review date approve should be defined",
    ]
    may: [
        "Contain comments or notes associated with each action",
        "Inform stakeholders upon action completion",
    ]
 ]
end;
end




# exmaple domain which imports import and using declarations
define domain "SDLC-IT-Company"
    version: "1.0.0"
    runtime: .net
    runver: "6.0"
    platform: x64
    cross-border: sanitize|encrypt
    explained as "module for software design concepts and specifications";
 
    import "1_1_0_imports.el";

    # some delegates here...

    end


# Complete example of domain declaration with imports and delegates
domain "ANTLR-to-ELIA-transformer"
    version "1.0.0"
    explained as "
        Transforms ANTLR parse tree into normalized E.L.I.A. instructions.
        Handles syntactic sugar, resolves ambiguities, normalizes constructs.";

    import module "ANTLR-Tokens" as AT version "1.0.0" from "concept/specifications/v0.9/examples/language%20primitive-antlr-tokens.el";
    import module "ELIA-Instructions" as EI version "1.0.0" from "concept/specifications/v0.9/examples/language%20primitive-elia-instructions.el";

    define export semantic interface "ANTLR to ELIA Transformation"
        explained as "
            Provides rules to transform ANTLR tokens into ELIA instructions.
            Ensures syntactic constructs are normalized and semantically valid.";
        by rule "transform-delegate-token",
        by rule "transform-definition-token",
        by definition "ANTLR Token",
        by definition "ELIA Instruction";
    end

    define flow "ANTLR to ELIA Transformation Flow" (antlrTokens: array of AT."ANTLR Token")
        explained as "
            Flow for transforming ANTLR tokens into ELIA instructions.
            Processes tokens sequentially, applying transformation rules.";
        
        stage "Parse ANTLR Tokens":
            # input of type AT."ANTLR Token"
        end
        stage "Transform Tokens":
            # processing applying rules from "ANTLR to ELIA Transformation"
        end
        stage "Generate ELIA Instructions":
            # output of type EI."ELIA Instruction"
        end
    end 

    define rule "transform-delegate-token" (token: ANTLRToken): ELIAInstruction
        explained as "
            Converts ANTLR delegate token into normalized instruction.
            - Extracts signature, mapped_to, bind_to
            - Resolves library references
            - Validates .ctor() presence
            - Normalizes this references"
    
    default infer null;
    end;
    
    define rule "transform-definition-token" (token: ANTLRToken): ELIAInstruction
        explained as "
            Converts definition token into semantic instruction.
            - Extracts metadata (version, dates)
            - Parses constraints into executable expressions
            - Resolves enforces dependencies";
    default infer null;
    end;

end
