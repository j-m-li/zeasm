// C++-like pseudocode (not actual working code)
class Base {
public:
    virtual int foo() { return 42; }
};

class Derived : public Base {
public:
    int foo() override { return 99; }
};

// usage
Base* obj = new Derived();
int result = obj->foo(); // Should call Derived::foo, returning 99

(module
  (type $fn_type (func (result i32))) ;; function signature: () -> i32

  (table $vtable 2 funcref) ;; vtable with 2 slots

  ;; Base::foo implementation
  (func $base_foo (type $fn_type)
    i32.const 42
  )

  ;; Derived::foo implementation
  (func $derived_foo (type $fn_type)
    i32.const 99
  )

  ;; Simulate 'object' as an offset in memory pointing to its vtable slot index
  (memory 1)
  (export "memory" (memory 0))

  ;; Helper to set up the vtables (run once)
  (func $init_vtable
    ;; vtable[0] = $base_foo
    (table.set (i32.const 0) (ref.func $base_foo))
    ;; vtable[1] = $derived_foo
    (table.set (i32.const 1) (ref.func $derived_foo))
  )

  ;; "Constructor" for Base: writes vtable index 0 at ptr
  (func (export "make_base") (param $ptr i32)
    (i32.store (local.get $ptr) (i32.const 0))
  )

  ;; "Constructor" for Derived: writes vtable index 1 at ptr
  (func (export "make_derived") (param $ptr i32)
    (i32.store (local.get $ptr) (i32.const 1))
  )

  ;; Simulate virtual call: reads vtable index from memory, calls correct function
  (func (export "call_foo") (param $ptr i32) (result i32)
    (call_indirect (type $fn_type)
      (i32.load (local.get $ptr)) ;; vtable index
    )
  )

  (start $init_vtable)
)

