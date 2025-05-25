(module
  ;; =======================
  ;; IMPORTS (functions, memory, table)
  ;; =======================
  (import "env" "imp" (func $imp (param i32) (result i32)))
  (import "env" "ext_mem" (memory 1))
  (import "env" "ext_table" (table 2 funcref))

  ;; =======================
  ;; TYPES
  ;; =======================
  (type $type0 (func (param i32 f32) (result i64)))
  (type $type1 (func (result i32)))

  ;; =======================
  ;; GLOBALS (mutable and immutable)
  ;; =======================
  (global $g (mut i32) (i32.const 0)) ;; mutable global
  (global $gi i32 (i32.const 5))      ;; immutable global

  ;; =======================
  ;; MEMORY & TABLE
  ;; =======================
  (memory $mem 1 2)                   ;; min 1 page, max 2 pages (1 page = 64KiB)
  (table $tab 4 funcref)              ;; table of 4 funcref entries

  ;; =======================
  ;; DATA & ELEMENT SEGMENTS
  ;; =======================
  ;; Data segments are byte arrays initialized into linear memory at specified offsets
  (data (i32.const 0) "hello, wasm!") ;; Offset 0 in memory gets these bytes

  ;; Element segments initialize tables with function references;
  ;; here, function references $f0 and $f1 go in table at offset 0 and 1
  (elem (i32.const 0) $f0 $f1)        

  ;; =======================
  ;; CONTROL FLOW, BLOCKS, VARIABLES
  ;; =======================
  (func $f0 (param $p0 i32) (result i32)
    (local $l0 i32)
    ;; block and loop with break/continue behavior
    (block $bl
      (loop $lp
        ;; br_if: break out of the block if $p0 > 10
        (br_if $bl (i32.gt_s (get_local $p0) (i32.const 10)))
        ;; set_local: increment local $l0
        (set_local $l0 (i32.add (get_local $l0) (i32.const 1)))
        ;; br: continue the loop (unconditional branch to $lp)
        (br $lp)
      )
    )
    ;; if/then/else with result
    (if (result i32) (i32.eqz (get_local $l0))
      (then (i32.const 111)) ;; if $l0 == 0
      (else (i32.const 222)) ;; otherwise
    )
  )

  ;; =======================
  ;; PARAMETRIC INSTRUCTIONS (drop, select)
  ;; =======================
  (func $f1 (param $p i32) (result i32)
    (drop (i32.const 99))   ;; drop discards a value on the stack
    ;; select chooses 1st or 2nd value based on condition (true=1st, false=2nd)
    (select (i32.const 1) (i32.const 2) (get_local $p))
  )

  ;; =======================
  ;; CALL & CALL_INDIRECT (function calls, dynamic dispatch)
  ;; =======================
  (func $f2 (param i32) (result i32)
    (call $imp (get_local 0))                   ;; direct call to imported function
    (call_indirect (type $type1) (i32.const 1)) ;; indirect call via table
  )

  ;; =======================
  ;; NUMERIC INSTRUCTIONS (i32/i64/f32/f64 arithmetic, conversion, comparison)
  ;; Now includes division and modulo/remainder instructions, with comments.
  ;; =======================
  (func $numeric (param i64) (param f32) (param f64) (result i32)
    (local $a i32) (local $b i64) (local $c f32) (local $d f64)
    ;; i32 arithmetic: a = 3 + (2 * 2) = 7
    (set_local $a (i32.add (i32.const 3) (i32.mul (i32.const 2) (i32.const 2))))
    ;; i32 division (signed): a = 10 / 2 = 5
    (set_local $a (i32.div_s (i32.const 10) (i32.const 2)))
    ;; i32 division (unsigned): a = 10 / 2 = 5
    (set_local $a (i32.div_u (i32.const 10) (i32.const 2)))
    ;; i32 remainder (signed): a = 10 % 3 = 1
    (set_local $a (i32.rem_s (i32.const 10) (i32.const 3)))
    ;; i32 remainder (unsigned): a = 10 % 3 = 1
    (set_local $a (i32.rem_u (i32.const 10) (i32.const 3)))
    ;; i64 division (signed): b = 20 / 2 = 10
    (set_local $b (i64.div_s (i64.const 20) (i64.const 2)))
    ;; i64 division (unsigned): b = 20 / 2 = 10
    (set_local $b (i64.div_u (i64.const 20) (i64.const 2)))
    ;; i64 remainder (signed): b = 20 % 3 = 2
    (set_local $b (i64.rem_s (i64.const 20) (i64.const 3)))
    ;; i64 remainder (unsigned): b = 20 % 3 = 2
    (set_local $b (i64.rem_u (i64.const 20) (i64.const 3)))
    ;; f32 division: c = 10.0 / 2.0 = 5.0
    (set_local $c (f32.div (f32.const 10.0) (f32.const 2.0)))
    ;; f64 division: d = 15.0 / 3.0 = 5.0
    (set_local $d (f64.div (f64.const 15.0) (f64.const 3.0)))
    ;; f32 math: sqrt
    (set_local $c (f32.sqrt (get_local 1)))
    ;; f64 math: abs
    (set_local $d (f64.abs (get_local 2)))
    ;; i32.trunc_f64_s: convert f64 to i32 (with saturation)
    (i32.trunc_f64_s (get_local $d))
  )

  ;; =======================
  ;; MEMORY INSTRUCTIONS (granular explanations)
  ;; =======================
  (func $memops
    ;; i32.load: Loads 4 bytes as signed int from memory at offset 0
    (drop (i32.load (i32.const 0)))
    ;; i32.store: Stores 4 bytes (value 9) to memory at offset 4
    (i32.store (i32.const 4) (i32.const 9))
    ;; i32.load8_s: Loads 1 byte from memory at offset 0, sign-extends to i32
    (drop (i32.load8_s (i32.const 0)))
    ;; i32.load8_u: Loads 1 byte from memory at offset 0, zero-extends to i32
    (drop (i32.load8_u (i32.const 0)))
    ;; i32.store8: Stores 1 byte (value 12) to memory at offset 5
    (i32.store8 (i32.const 5) (i32.const 12))
    ;; i32.load16_s: Loads 2 bytes from memory at offset 6, sign-extends to i32
    (drop (i32.load16_s (i32.const 6)))
    ;; i32.load16_u: Loads 2 bytes from memory at offset 6, zero-extends to i32
    (drop (i32.load16_u (i32.const 6)))
    ;; i32.store16: Stores 2 bytes (value 0x1234) to memory at offset 8
    (i32.store16 (i32.const 8) (i32.const 0x1234))
    ;; memory.size: Returns the current memory size in 64KiB pages
    (drop (memory.size))
    ;; memory.grow: Grows memory by 1 page, returns previous page count (or -1 if failed)
    (drop (memory.grow (i32.const 1)))
    ;; memory.fill: Fills 10 bytes at offset 20 with value 0xAB
    (memory.fill (i32.const 20) (i32.const 0xAB) (i32.const 10))
    ;; memory.copy: Copies 8 bytes from offset 0 to offset 32
    (memory.copy (i32.const 32) (i32.const 0) (i32.const 8))
    ;; memory.init 0: Copies 5 bytes from passive data segment 0 to offset 40 in memory
    (memory.init 0 (i32.const 40) (i32.const 0) (i32.const 5))
    ;; data.drop 0: Marks data segment 0 as dropped (cannot use it again)
    (data.drop 0)
  )

  ;; =======================
  ;; TABLE INSTRUCTIONS (granular explanations)
  ;; =======================
  (func $tabops
    ;; table.set: Sets table[$tab][0] = ref.func $f0
    (table.set $tab (i32.const 0) (ref.func $f0))
    ;; table.get: Gets table[$tab][0], leaves funcref on stack (drop it)
    (drop (table.get $tab (i32.const 0)))
    ;; table.copy: Copies 2 elements from $tab[1] to $tab[3]
    (table.copy $tab $tab (i32.const 3) (i32.const 1) (i32.const 2))
    ;; table.fill: Fills $tab[2] and $tab[3] with ref.null func
    (table.fill $tab (i32.const 2) (ref.null func) (i32.const 2))
    ;; table.size: Returns size of $tab
    (drop (table.size $tab))
    ;; table.grow: Grows $tab by 1 with ref.null func (returns old size or -1)
    (table.grow $tab (ref.null func) (i32.const 1))
    ;; table.init 0: Copies 2 elements from passive element segment 0 to $tab[0] and $tab[1]
    (table.init 0 (i32.const 0) (i32.const 0) (i32.const 2))
    ;; elem.drop 0: Marks element segment 0 as dropped (cannot use it again)
    (elem.drop 0)
  )

  ;; =======================
  ;; REFERENCE INSTRUCTIONS (reference types)
  ;; =======================
  (func $refs
    ;; ref.null: Pushes a null funcref onto the stack
    (ref.null func)
    ;; ref.is_null: Checks if a funcref is null (returns 1 if true, 0 if false)
    (ref.is_null (ref.func $f0))
    ;; ref.func: Gets a reference to the function $f0
    (ref.func $f0)
    drop ;; discard the reference
  )

  ;; =======================
  ;; GLOBAL INSTRUCTIONS (get/set global value)
  ;; =======================
  (func $globalops (result i32)
    ;; global.set: Sets the mutable global $g to 6
    (global.set $g (i32.const 6))
    ;; global.get: Gets value of global $g
    (global.get $g)
  )

  ;; =======================
  ;; BULK MEMORY OPERATIONS (init, drop for data/elem segments)
  ;; =======================
  (func $bulk
    ;; memory.init 0: Copies 5 bytes from passive data segment 0 to memory offset 0
    (memory.init 0 (i32.const 0) (i32.const 0) (i32.const 5))
    ;; data.drop 0: Marks data segment 0 as dropped
    (data.drop 0)
    ;; elem.drop 0: Marks element segment 0 as dropped
    (elem.drop 0)
  )

  ;; =======================
  ;; EXPORTS (functions, globals, memory, table)
  ;; =======================
  (export "f0" (func $f0))
  (export "f1" (func $f1))
  (export "f2" (func $f2))
  (export "numeric" (func $numeric))
  (export "memops" (func $memops))
  (export "tabops" (func $tabops))
  (export "refs" (func $refs))
  (export "globalops" (func $globalops))
  (export "bulk" (func $bulk))
  (export "g" (global $g))
  (export "mem" (memory $mem))
  (export "tab" (table $tab))
)