(module 
   (import "std" "print" (func $print (param i32)))
   (memory (export "memory") 1)
   (data (i32.const 0) "\0DHello, 世界!")
   (data (i32.const 16) "\01!")
   (func $add 
      (param $a i32) 
      (param $b i32) 
      (result i32) 
      local.get $a 
      local.get $b 
      i32.add

      i32.const 0 ;; string ptr (4 bytes aligned)
      call $print
      i32.const 16
      call $print
   ) 
   (func $event
      (param $a i32) 
      i32.const 20 ;; offset of term class
      i32.const 24 ;; offset of data buffer
      i32.add
      call $print
   )
   (func $term__new (result i32)
      i32.const 20 
   )
   (export "add" (func $add))
   (export "term__new" (func $term__new))
   (export "event" (func $event))
)

