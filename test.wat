(module 
   (import "console" "log" (func $log (param i32)))
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
      call $log
      i32.const 16
      call $log
   ) 
   (export "add" (func $add))
)

