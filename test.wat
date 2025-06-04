(module 
    (import "wasi_snapshot_preview1" "fd_write"
    (func $fd_write (param i32 i32 i32 i32) (result i32))
    )
      (import "wasi_snapshot_preview1" "fd_read"
    (func $fd_read (param i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "proc_exit"
    (func $proc_exit (param i32)))

;;   (import "std" "print" (func $print (param i32)))
   (memory (export "memory") 1)
   (data (i32.const 0) "\0DHello, 世界!")
   (data (i32.const 16) "\01!")
   (data (i32.const 20) "event")
   (data (i32.const 44) "event buffer")
   (data (i32.const 172) "free memory")
  ;; Data: buffer for input (32 bytes)
  (data (i32.const 1024) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")

  ;; iovec struct for WASI (pointer to buffer and length)
  ;; struct iovec { void* buf; size_t buf_len; }
  ;; iovec at offset 2048: [i32=ptr to buffer, i32=len]
  (data (i32.const 2048) "\00\04\00\00\20\00\00\00") ;; 1024 (0x00000400), 32 (0x00000020)

   (func $add 
      (param $a i32) 
      (param $b i32) 
      (result i32) 
      local.get $a 
      local.get $b 
      i32.add

      i32.const 0 ;; string ptr (4 bytes aligned)
     ;; call $print
     drop
      i32.const 16
      drop
     ;; call $print
   ) 
   (func $event
      (param $a i32) 
      i32.const 20 ;; offset of event class
      i32.const 24 ;; offset of data buffer in event
      i32.add
   ;;   call $print
   	drop
   )
   (func $init (result i32)
      i32.const 20 
   )
  ;; iovec struct for fd_write: { pointer, length }
  ;; We'll store it at offset 0
  ;; pointer = 8, length = 13

  (func $main 
    (local $nread i32)
    (local $ret i32)
    ;; iovec[0].buf = 1
    (i32.store (i32.const 0) (i32.const 8))
    ;; iovec[0].buf_len = 13
    (i32.store (i32.const 4) (i32.const 13))
	
    ;; call fd_write(fd=1, iovs=0, iovs_len=1, nwritten=20)
    (call $fd_write
      (i32.const 1)    ;; fd (stdout)
      (i32.const 0)    ;; iovs (pointer to iovec struct)
      (i32.const 1)    ;; iovs_len
      (i32.const 172)  ;; nwritten (where to store number of bytes written)
    )
    drop ;; Ignore the return value

        ;; fd_read(fd=0, iovs=2048, iovs_len=1, nread=3000)
    (i32.store (i32.const 3000) (i32.const 0)) ;; zero out nread
    (call $fd_read
      (i32.const 0)       ;; fd=0 (stdin)
      (i32.const 2048)    ;; iovs
      (i32.const 1)       ;; iovs_len
      (i32.const 3000)    ;; nread
    )
    drop                  ;; ignore return value (errno)
    ;; Optionally, you can process the input buffer at 1024 of up to 32 bytes
    ;; Read how many bytes were read (from 3000)
    ;; (not used here, but you can use it for logic)
    (local.set $nread (i32.load (i32.const 3000)))
    (call $fd_read
      (i32.const 0)       ;; fd=0 (stdin)
      (i32.const 2048)    ;; iovs
      (local.get $nread)       ;; iovs_len
      (i32.const 3000)    ;; nread
    )
    drop
    ;; Exit with code 0
    (call $proc_exit (i32.const 0))
  )

   (export "add" (func $add))
   (export "init" (func $init))
   (export "event" (func $event))
   (export "_start" (func $main))

)

