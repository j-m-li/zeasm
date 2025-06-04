#ifndef WASI_SNAPSHOT_PREVIEW1_H
#define WASI_SNAPSHOT_PREVIEW1_H

#ifdef __cplusplus
extern "C" {
#endif

/* --- Primitive Types --- */
typedef unsigned char wasi_u8_t;
typedef unsigned short wasi_u16_t;
typedef unsigned long wasi_u32_t;
typedef unsigned long long wasi_u64_t;
typedef signed char wasi_s8_t;
typedef signed short wasi_s16_t;
typedef signed long wasi_s32_t;
typedef signed long long wasi_s64_t;

/* --- WASI Scalar Types --- */
typedef wasi_u32_t wasi_size_t;
typedef wasi_u64_t wasi_filesize_t;
typedef wasi_u64_t wasi_timestamp_t;
typedef wasi_u64_t wasi_dircookie_t;
typedef wasi_u32_t wasi_dirnamlen_t;
typedef wasi_u64_t wasi_inode_t;
typedef wasi_u64_t wasi_device_t;
typedef wasi_u64_t wasi_userdata_t;
typedef wasi_u64_t wasi_linkcount_t;
typedef wasi_s64_t wasi_filedelta_t;
typedef wasi_u32_t wasi_exitcode_t;
typedef wasi_u16_t wasi_siflags_t;
typedef wasi_u16_t wasi_riflags_t;
typedef wasi_u16_t wasi_roflags_t;

/* --- WASI Handle Types --- */
typedef wasi_u32_t wasi_fd_t;

/* --- Enums and Flags --- */

/* wasi_errno_t (u16) */
enum wasi_errno_t {
    WASI_ESUCCESS = 0,
    WASI_E2BIG,
    WASI_EACCES,
    WASI_EADDRINUSE,
    WASI_EADDRNOTAVAIL,
    WASI_EAFNOSUPPORT,
    WASI_EAGAIN,
    WASI_EALREADY,
    WASI_EBADF,
    WASI_EBADMSG,
    WASI_EBUSY,
    WASI_ECANCELED,
    WASI_ECHILD,
    WASI_ECONNABORTED,
    WASI_ECONNREFUSED,
    WASI_ECONNRESET,
    WASI_EDEADLK,
    WASI_EDESTADDRREQ,
    WASI_EDOM,
    WASI_EDQUOT,
    WASI_EEXIST,
    WASI_EFAULT,
    WASI_EFBIG,
    WASI_EHOSTUNREACH,
    WASI_EIDRM,
    WASI_EILSEQ,
    WASI_EINPROGRESS,
    WASI_EINTR,
    WASI_EINVAL,
    WASI_EIO,
    WASI_EISCONN,
    WASI_EISDIR,
    WASI_ELOOP,
    WASI_EMFILE,
    WASI_EMLINK,
    WASI_EMSGSIZE,
    WASI_EMULTIHOP,
    WASI_ENAMETOOLONG,
    WASI_ENETDOWN,
    WASI_ENETRESET,
    WASI_ENETUNREACH,
    WASI_ENFILE,
    WASI_ENOBUFS,
    WASI_ENODEV,
    WASI_ENOENT,
    WASI_ENOEXEC,
    WASI_ENOLCK,
    WASI_ENOLINK,
    WASI_ENOMEM,
    WASI_ENOMSG,
    WASI_ENOPROTOOPT,
    WASI_ENOSPC,
    WASI_ENOSYS,
    WASI_ENOTCONN,
    WASI_ENOTDIR,
    WASI_ENOTEMPTY,
    WASI_ENOTRECOVERABLE,
    WASI_ENOTSOCK,
    WASI_ENOTSUP,
    WASI_ENOTTY,
    WASI_ENXIO,
    WASI_EOVERFLOW,
    WASI_EOWNERDEAD,
    WASI_EPERM,
    WASI_EPIPE,
    WASI_EPROTO,
    WASI_EPROTONOSUPPORT,
    WASI_EPROTOTYPE,
    WASI_ERANGE,
    WASI_EROFS,
    WASI_ESPIPE,
    WASI_ESRCH,
    WASI_ESTALE,
    WASI_ETIMEOUT,
    WASI_ETXTBSY,
    WASI_EXDEV,
    WASI_ENOTCAPABLE
};

/* wasi_filetype_t (u8) */
enum wasi_filetype_t {
    WASI_FILETYPE_UNKNOWN = 0,
    WASI_FILETYPE_BLOCK_DEVICE,
    WASI_FILETYPE_CHARACTER_DEVICE,
    WASI_FILETYPE_DIRECTORY,
    WASI_FILETYPE_REGULAR_FILE,
    WASI_FILETYPE_SOCKET_DGRAM,
    WASI_FILETYPE_SOCKET_STREAM,
    WASI_FILETYPE_SYMBOLIC_LINK
};

/* wasi_clockid_t (u32) */
enum wasi_clockid_t {
    WASI_CLOCKID_REALTIME = 0,
    WASI_CLOCKID_MONOTONIC,
    WASI_CLOCKID_PROCESS_CPUTIME_ID,
    WASI_CLOCKID_THREAD_CPUTIME_ID
};

/* wasi_whence_t (u8) */
enum wasi_whence_t {
    WASI_WHENCE_SET = 0,
    WASI_WHENCE_CUR,
    WASI_WHENCE_END
};

/* wasi_advice_t (u8) */
enum wasi_advice_t {
    WASI_ADVICE_NORMAL = 0,
    WASI_ADVICE_SEQUENTIAL,
    WASI_ADVICE_RANDOM,
    WASI_ADVICE_WILLNEED,
    WASI_ADVICE_DONTNEED,
    WASI_ADVICE_NOREUSE
};

/* wasi_eventtype_t (u8) */
enum wasi_eventtype_t {
    WASI_EVENTTYPE_CLOCK = 0,
    WASI_EVENTTYPE_FD_READ,
    WASI_EVENTTYPE_FD_WRITE
};

/* wasi_signal_t (u8) */
enum wasi_signal_t {
    WASI_SIGNAL_NONE = 0,
    WASI_SIGNAL_HUP,
    WASI_SIGNAL_INT,
    WASI_SIGNAL_QUIT,
    WASI_SIGNAL_ILL,
    WASI_SIGNAL_TRAP,
    WASI_SIGNAL_ABRT,
    WASI_SIGNAL_BUS,
    WASI_SIGNAL_FPE,
    WASI_SIGNAL_KILL,
    WASI_SIGNAL_USR1,
    WASI_SIGNAL_SEGV,
    WASI_SIGNAL_USR2,
    WASI_SIGNAL_PIPE,
    WASI_SIGNAL_ALRM,
    WASI_SIGNAL_TERM,
    WASI_SIGNAL_CHLD,
    WASI_SIGNAL_CONT,
    WASI_SIGNAL_STOP,
    WASI_SIGNAL_TSTP,
    WASI_SIGNAL_TTIN,
    WASI_SIGNAL_TTOU,
    WASI_SIGNAL_URG,
    WASI_SIGNAL_XCPU,
    WASI_SIGNAL_XFSZ,
    WASI_SIGNAL_VTALRM,
    WASI_SIGNAL_PROF,
    WASI_SIGNAL_WINCH,
    WASI_SIGNAL_POLL,
    WASI_SIGNAL_PWR,
    WASI_SIGNAL_SYS
};

/* wasi_preopentype_t (u8) */
enum wasi_preopentype_t {
    WASI_PREOPENTYPE_DIR = 0
};

/* wasi_sdflags_t (u8) */
#define WASI_SDFLAGS_RD 0x1
#define WASI_SDFLAGS_WR 0x2

/* wasi_fdflags_t (u16) */
#define WASI_FDFLAGS_APPEND   0x0001
#define WASI_FDFLAGS_DSYNC    0x0002
#define WASI_FDFLAGS_NONBLOCK 0x0004
#define WASI_FDFLAGS_RSYNC    0x0008
#define WASI_FDFLAGS_SYNC     0x0010

/* wasi_oflags_t (u16) */
#define WASI_OFLAGS_CREAT     0x0001
#define WASI_OFLAGS_DIRECTORY 0x0002
#define WASI_OFLAGS_EXCL      0x0004
#define WASI_OFLAGS_TRUNC     0x0008

/* wasi_rights_t (u64) */
#define WASI_RIGHT_FD_DATASYNC        ((wasi_u64_t)1 << 0)
#define WASI_RIGHT_FD_READ            ((wasi_u64_t)1 << 1)
#define WASI_RIGHT_FD_SEEK            ((wasi_u64_t)1 << 2)
#define WASI_RIGHT_FD_FDSTAT_SET_FLAGS ((wasi_u64_t)1 << 3)
#define WASI_RIGHT_FD_SYNC            ((wasi_u64_t)1 << 4)
#define WASI_RIGHT_FD_TELL            ((wasi_u64_t)1 << 5)
#define WASI_RIGHT_FD_WRITE           ((wasi_u64_t)1 << 6)
#define WASI_RIGHT_FD_ADVISE          ((wasi_u64_t)1 << 7)
#define WASI_RIGHT_FD_ALLOCATE        ((wasi_u64_t)1 << 8)
#define WASI_RIGHT_PATH_CREATE_DIRECTORY ((wasi_u64_t)1 << 9)
#define WASI_RIGHT_PATH_CREATE_FILE   ((wasi_u64_t)1 << 10)
#define WASI_RIGHT_PATH_LINK_SOURCE   ((wasi_u64_t)1 << 11)
#define WASI_RIGHT_PATH_LINK_TARGET   ((wasi_u64_t)1 << 12)
#define WASI_RIGHT_PATH_OPEN          ((wasi_u64_t)1 << 13)
#define WASI_RIGHT_FD_READDIR         ((wasi_u64_t)1 << 14)
#define WASI_RIGHT_PATH_READLINK      ((wasi_u64_t)1 << 15)
#define WASI_RIGHT_PATH_RENAME_SOURCE ((wasi_u64_t)1 << 16)
#define WASI_RIGHT_PATH_RENAME_TARGET ((wasi_u64_t)1 << 17)
#define WASI_RIGHT_PATH_FILESTAT_GET  ((wasi_u64_t)1 << 18)
#define WASI_RIGHT_PATH_FILESTAT_SET_SIZE ((wasi_u64_t)1 << 19)
#define WASI_RIGHT_PATH_FILESTAT_SET_TIMES ((wasi_u64_t)1 << 20)
#define WASI_RIGHT_FD_FILESTAT_GET    ((wasi_u64_t)1 << 21)
#define WASI_RIGHT_FD_FILESTAT_SET_SIZE ((wasi_u64_t)1 << 22)
#define WASI_RIGHT_FD_FILESTAT_SET_TIMES ((wasi_u64_t)1 << 23)
#define WASI_RIGHT_PATH_SYMLINK       ((wasi_u64_t)1 << 24)
#define WASI_RIGHT_PATH_REMOVE_DIRECTORY ((wasi_u64_t)1 << 25)
#define WASI_RIGHT_PATH_UNLINK_FILE   ((wasi_u64_t)1 << 26)
#define WASI_RIGHT_POLL_FD_READWRITE  ((wasi_u64_t)1 << 27)
#define WASI_RIGHT_SOCK_SHUTDOWN      ((wasi_u64_t)1 << 28)
#define WASI_RIGHT_SOCK_ACCEPT        ((wasi_u64_t)1 << 29)

/* Event read/write flags */
#define WASI_EVENTRWFLAGS_FD_READWRITE_HANGUP 0x1

/* Subclockflags */
#define WASI_SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME 0x1


/* --- Structs --- */

struct wasi_iovec_t {
    void *buf;
    wasi_size_t buf_len;
};

struct wasi_ciovec_t {
    const void *buf;
    wasi_size_t buf_len;
};

struct wasi_fdstat_t {
    wasi_u8_t fs_filetype;
    wasi_u16_t fs_flags;
    wasi_u64_t fs_rights_base;
    wasi_u64_t fs_rights_inheriting;
};

struct wasi_filestat_t {
    wasi_u64_t dev;
    wasi_u64_t ino;
    wasi_u8_t filetype;
    wasi_u64_t nlink;
    wasi_u64_t size;
    wasi_u64_t atim;
    wasi_u64_t mtim;
    wasi_u64_t ctim;
};

struct wasi_dirent_t {
    wasi_dircookie_t d_next;
    wasi_inode_t d_ino;
    wasi_dirnamlen_t d_namlen;
    wasi_u8_t d_type;
};

struct wasi_prestat_dir_t {
    wasi_size_t pr_name_len;
};

struct wasi_prestat_t {
    wasi_u8_t tag;
    union {
        struct wasi_prestat_dir_t prestat_dir;
    } u;
};

/* --- Event/Subscription Structs --- */

/* For event_fd_readwrite */
struct wasi_event_fd_readwrite_t {
    wasi_u64_t nbytes;
    wasi_u16_t flags; /* eventrwflags */
};

/* For event */
struct wasi_event_t {
    wasi_u64_t userdata;
    wasi_u16_t error;
    wasi_u8_t  type; /* eventtype */
    struct wasi_event_fd_readwrite_t fd_readwrite;
};

/* For subscription_clock */
struct wasi_subscription_clock_t {
    wasi_u32_t id; /* clockid */
    wasi_u64_t timeout;
    wasi_u64_t precision;
    wasi_u16_t flags; /* subclockflags */
};

/* For subscription_fd_readwrite */
struct wasi_subscription_fd_readwrite_t {
    wasi_u32_t file_descriptor; /* fd */
};

/* Union for subscription_u */
union wasi_subscription_u_t {
    struct wasi_subscription_clock_t clock;
    struct wasi_subscription_fd_readwrite_t fd_read;
    struct wasi_subscription_fd_readwrite_t fd_write;
};

/* Subscription */
struct wasi_subscription_t {
    wasi_u64_t userdata;
    wasi_u8_t  tag; /* eventtype: 0=clock, 1=fd_read, 2=fd_write */
    union wasi_subscription_u_t u;
};

/* --- Function Prototypes --- */
/* Only the signatures, as C90 does not support named parameters */

wasi_errno_t wasi_args_get(char **argv, char *argv_buf);
wasi_errno_t wasi_args_sizes_get(wasi_size_t *argc, wasi_size_t *argv_buf_size);
wasi_errno_t wasi_environ_get(char **environ, char *environ_buf);
wasi_errno_t wasi_environ_sizes_get(wasi_size_t *environ_count, wasi_size_t *environ_buf_size);
wasi_errno_t wasi_clock_res_get(wasi_clockid_t id, wasi_timestamp_t *res);
wasi_errno_t wasi_clock_time_get(wasi_clockid_t id, wasi_timestamp_t precision, wasi_timestamp_t *time);
wasi_errno_t wasi_fd_advise(wasi_fd_t fd, wasi_filesize_t offset, wasi_filesize_t len, wasi_advice_t advice);
wasi_errno_t wasi_fd_allocate(wasi_fd_t fd, wasi_filesize_t offset, wasi_filesize_t len);
wasi_errno_t wasi_fd_close(wasi_fd_t fd);
wasi_errno_t wasi_fd_datasync(wasi_fd_t fd);
wasi_errno_t wasi_fd_fdstat_get(wasi_fd_t fd, struct wasi_fdstat_t *buf);
wasi_errno_t wasi_fd_fdstat_set_flags(wasi_fd_t fd, wasi_u16_t flags);
wasi_errno_t wasi_fd_fdstat_set_rights(wasi_fd_t fd, wasi_u64_t base, wasi_u64_t inheriting);
wasi_errno_t wasi_fd_filestat_get(wasi_fd_t fd, struct wasi_filestat_t *buf);
wasi_errno_t wasi_fd_filestat_set_size(wasi_fd_t fd, wasi_filesize_t size);
wasi_errno_t wasi_fd_filestat_set_times(wasi_fd_t fd, wasi_timestamp_t atim, wasi_timestamp_t mtim, wasi_u16_t fst_flags);
wasi_errno_t wasi_fd_pread(wasi_fd_t fd, const struct wasi_iovec_t *iovs, wasi_size_t iovs_len, wasi_filesize_t offset, wasi_size_t *nread);
wasi_errno_t wasi_fd_prestat_get(wasi_fd_t fd, struct wasi_prestat_t *buf);
wasi_errno_t wasi_fd_prestat_dir_name(wasi_fd_t fd, char *path, wasi_size_t path_len);
wasi_errno_t wasi_fd_pwrite(wasi_fd_t fd, const struct wasi_ciovec_t *iovs, wasi_size_t iovs_len, wasi_filesize_t offset, wasi_size_t *nwritten);
wasi_errno_t wasi_fd_read(wasi_fd_t fd, const struct wasi_iovec_t *iovs, wasi_size_t iovs_len, wasi_size_t *nread);
wasi_errno_t wasi_fd_readdir(wasi_fd_t fd, void *buf, wasi_size_t buf_len, wasi_dircookie_t cookie, wasi_size_t *nread);
wasi_errno_t wasi_fd_renumber(wasi_fd_t fd, wasi_fd_t to);
wasi_errno_t wasi_fd_seek(wasi_fd_t fd, wasi_filedelta_t offset, wasi_u8_t whence, wasi_filesize_t *newoffset);
wasi_errno_t wasi_fd_sync(wasi_fd_t fd);
wasi_errno_t wasi_fd_tell(wasi_fd_t fd, wasi_filesize_t *offset);
wasi_errno_t wasi_fd_write(wasi_fd_t fd, const struct wasi_ciovec_t *iovs, wasi_size_t iovs_len, wasi_size_t *nwritten);
wasi_errno_t wasi_path_create_directory(wasi_fd_t fd, const char *path);
wasi_errno_t wasi_path_filestat_get(wasi_fd_t fd, wasi_u32_t flags, const char *path, struct wasi_filestat_t *buf);
wasi_errno_t wasi_path_filestat_set_times(wasi_fd_t fd, wasi_u32_t flags, const char *path, wasi_timestamp_t atim, wasi_timestamp_t mtim, wasi_u16_t fst_flags);
wasi_errno_t wasi_path_link(wasi_fd_t old_fd, wasi_u32_t old_flags, const char *old_path, wasi_fd_t new_fd, const char *new_path);
wasi_errno_t wasi_path_open(wasi_fd_t fd, wasi_u32_t dirflags, const char *path, wasi_u16_t oflags, wasi_u64_t fs_rights_base, wasi_u64_t fs_rights_inheriting, wasi_u16_t fdflags, wasi_fd_t *opened_fd);
wasi_errno_t wasi_path_readlink(wasi_fd_t fd, const char *path, char *buf, wasi_size_t buf_len, wasi_size_t *nread);
wasi_errno_t wasi_path_remove_directory(wasi_fd_t fd, const char *path);
wasi_errno_t wasi_path_rename(wasi_fd_t fd, const char *old_path, wasi_fd_t new_fd, const char *new_path);
wasi_errno_t wasi_path_symlink(const char *old_path, wasi_fd_t fd, const char *new_path);
wasi_errno_t wasi_path_unlink_file(wasi_fd_t fd, const char *path);
wasi_errno_t wasi_poll_oneoff(const void *in, void *out, wasi_size_t nsubscriptions, wasi_size_t *nevents);
void wasi_proc_exit(wasi_exitcode_t rval);
wasi_errno_t wasi_proc_raise(wasi_signal_t sig);
wasi_errno_t wasi_sched_yield(void);
wasi_errno_t wasi_random_get(void *buf, wasi_size_t buf_len);
wasi_errno_t wasi_sock_accept(wasi_fd_t fd, wasi_u16_t flags, wasi_fd_t *new_sock);
wasi_errno_t wasi_sock_recv(wasi_fd_t fd, struct wasi_iovec_t *ri_data, wasi_size_t ri_data_len, wasi_u16_t ri_flags, wasi_size_t *nread, wasi_u16_t *roflags);
wasi_errno_t wasi_sock_send(wasi_fd_t fd, const struct wasi_ciovec_t *si_data, wasi_size_t si_data_len, wasi_u16_t si_flags, wasi_size_t *nwritten);
wasi_errno_t wasi_sock_shutdown(wasi_fd_t fd, wasi_u8_t how);


#ifdef __cplusplus
}
#endif

#endif /* WASI_SNAPSHOT_PREVIEW1_H */
