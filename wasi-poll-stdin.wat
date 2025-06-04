(module
  ;; Import WASI functions
  (import "wasi_snapshot_preview1" "fd_read"
    (func $fd_read (param i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "poll_oneoff"
    (func $poll_oneoff (param i32 i32 i32 i32) (result i32)))
 (import "wasi_snapshot_preview1" "proc_exit"
    (func $proc_exit (param i32)))


  ;; Set up memory for events, subscriptions, buffer, etc.
  (memory 1)
  (export "memory" (memory 0))

  ;; ---- Subscription structure ----
  ;; subscription[0]:
  ;; userdata = 1234 (i64), type = 0 (FD_READ), fd = 0 (stdin)
  ;; Layout: [userdata (8 bytes)] [type (4 bytes)] [padding (4 bytes)] [fd (4 bytes)] [padding (4 bytes)]
  (data (i32.const 0)
    "\d2\04\00\00\00\00\00\00"   ;; userdata = 1234
    "\00\00\00\00"                 ;; type = 0 (FD_READ)
    "\00\00\00\00"                 ;; padding
    "\00\00\00\00"                 ;; fd = 0 (stdin)
    "\00\00\00\00"                 ;; padding
  )

  ;; ---- iovec for fd_read ----
  (data (i32.const 32)
    "\40\00\00\00"  ;; buf ptr = 64
    "\10\00\00\00"  ;; buf len = 16
  )

  ;; ---- buffer for read ----
  (data (i32.const 64)
    "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"
  )

  ;; ---- event output for poll_oneoff ----
  ;; event[0] output will be at offset 100

  (func (export "_start")
    (local $n_events i32)
    (local $nread i32)
    (i32.store (i32.const 200) (i32.const 0)) 
    ;; poll_oneoff(in=0, out=100, n=1, nevents=200)
    (call $poll_oneoff
      (i32.const 0)   ;; in: subscriptions at 0
      (i32.const 128) ;; out: events at 100
      (i32.const 1)   ;; nsubscriptions = 1
      (i32.const 200) ;; nevents written goes here
    )
    drop
    (call $poll_oneoff
      (i32.const 0)   ;; in: subscriptions at 0
      (i32.const 128) ;; out: events at 100
      (i32.const 1)   ;; nsubscriptions = 1
      (i32.const 200) ;; nevents written goes here
    )
    drop
;;	       (call  $proc_exit )

    (local.set $n_events (i32.load (i32.const 200)))
	       (call  $proc_exit (local.get $n_events))
    ;; Now read if stdin is ready
    ;; Prepare nread result location
    (i32.store (i32.const 80) (i32.const 0)) ;; clear nread
    (block $case0
	(block $default (br_table $case0 $default (local.get $n_events)))

    (call $fd_read
      (i32.const 0)    ;; fd = 0 (stdin)
      (i32.const 32)   ;; iovs = 32
      (i32.const 1)    ;; iovs_len = 1
      (i32.const 80)   ;; nread = 80
    )
	drop
	       (call  $proc_exit (local.get $n_events))
    )
    ;; After execution, the buffer at 64 will contain the read bytes.
    ;; The number of bytes read will be at offset 80.
    ;; The poll_oneoff event result will be at 100.

    (call $fd_read
      (i32.const 0)    ;; fd = 0 (stdin)
      (i32.const 32)   ;; iovs = 32
      (i32.const 1)    ;; iovs_len = 1
      (i32.const 80)   ;; nread = 80
    )
	drop
  
  
	       (call  $proc_exit (i32.const 110))
    )
)
