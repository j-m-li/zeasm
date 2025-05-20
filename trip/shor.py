
# https://www.youtube.com/watch?v=qPgqcSA8dzc&list=PLMP-9Tz3oGTbetMh794L-SesaxSjhfLzG

import numpy 
import random
import time
import math
import cmath
import sys
import matplotlib.pyplot as plt

def plot(P):
    fig = plt.figure(figsize=(12,5))
    axis = fig.add_subplot(1,1,1)
    axis.plot(P)
    plt.show()
    return 

def convergent(p, q, b):
    n = 0
    p_n_minus2 = 0
    p_n_minus1 = 1
    q_n_minus1 = 0
    q_n_minus2 = 1
    while (q != 0):
        #
        # Compute a_n
        #
        a_n = p // q
        r = p % q
        p = q
        q = r
        n = n + 1
        #
        # Compute p_n and q_n
        #
        p_n = a_n * p_n_minus1 + p_n_minus2
        q_n = a_n * q_n_minus1 + q_n_minus2
        #
        # If we have reached the precision or
        # the desired number of steps return result
        #
        if q_n > b:
            return p_n_minus1, q_n_minus1
        #
        # Shift variables
        #
        q_n_minus2 = q_n_minus1
        q_n_minus1 = q_n
        p_n_minus2 = p_n_minus1
        p_n_minus1 = p_n
    return p_n, q_n


# a est un nombre choisi au hasard
def rshor(a, P):
    n = int(numpy.log2(P**2))
    N = 2**n
    M = P
    success = 0
    #return 16
    #state = [[(0+0j) for x in range(M)] for y in range(N)]
    state = numpy.zeros((N,M),dtype=complex)
    d = math.sqrt(N)
    for k in range(N):
       y = pow(a,k,M)
       state[k][y] = (1+0j)  / d

    state = fft(state)
    P = [0 for x in range(N)]
    for s in range(N):
       for i in range(M):
           P[s] = P[s] + abs(state[s][i])**2

    n = 0
    x = 0
    s =0 
    u = 0.0;
    for i in P:
        if n==N//2:
            break
        x = x + i
        if ((i > 10*u or (i>u and n==s+1)) and n > 0):
            u = i 
            s = n
        n += 1
 #   plot(P)
    c,r = convergent(s,N,M)
    r = int(r)
    if (r&1):
        r = r * 2
    return r

def shor(P):
    """algorithme de shor: factorisation de P"""
    while True:
        a = random.randint(2, P-1)
        print (u"=====> Essai avec a=", a, " P=", P)

        x = pgcd(a,P)
        if x!=1:
            n1 = x
            n2 = P//n1
            print (u"Trouvé immédiatement: n1=", n1, "n2=", n2)
            return [n1, n2]
        else:
            r = rshor(a, P)  # calcul de la periode de f(k) = (a**k)%P par la fonction separee rshor()
            print (u"période r=", r)

            if r&1!=1:
                x = pow(a, r//2,P) # ('//' est une division d'entiers)
                print (u"calcul de a**(r//2) = ", x)
                if x%P!=1:
                    n1 = pgcd(x+1, P)  #n1 = pgcd(a**(r//2)+1, P)
                    n2 = pgcd(x-1, P)  #n2 = pgcd(a**(r//2)-1, P)
                    if (n1!=1 and n2!=1):
                        print ("Solution: n1=", n1, "n2=", n2)
                        return [n1, n2]
                    else :
                        print ("NO Solution: n1=", n1, "n2=", n2, "")

            # si on arrive ici, on boucle pour essayer un autre "a"

def pgcd(a,b):
    """pgcd(a,b): calcul du 'PGCD' entre les 2 nombres entiers a et b"""
    a, b = abs(a), abs(b)
    while b:
        r = a%b
        a, b = b, r
    return a

def lpowmod(a, b, n):
    """exponentiation modulaire: (a**b)%n"""
    r = 1
    while b>0:
        if b&1==0:
            b = b>>1
        else:
            r = (r*a)%n
            b = (b-1)>>1
        a = (a*a)%n
    return r

def omega(p, q):
   return numpy.exp((-2j * numpy.pi * p) / q)

def fft(x):
    """
    radix-2,3,5 FFT algorithm
    """
    N = len(x)
    if N <= 1:
        return x

    if N % 2 == 0:
        # For multiples of 2 this formula works
        even = fft(x[0::2])
        odd =  fft(x[1::2])
        T = [numpy.exp(-2j*numpy.pi*k/N)*odd[k] for k in range(N//2)]
        return [even[k] + T[k] for k in range(N//2)] + \
               [even[k] - T[k] for k in range(N//2)]
    elif N % 3 == 0:
        # Optional, implementing factor 3 decimation
        p0 = fft(x[0::3])
        p1 = fft(x[1::3])
        p2 = fft(x[2::3])
        # This will construct the output output without the simplifications
        # you can do explorint symmetry
        return [p0[k % (N//3)] +
                p1[k % (N//3)] * numpy.exp(-2j*numpy.pi*k/N) +
                p2[k % (N//3)] * numpy.exp(-4j*numpy.pi*k/N)
               for k in range(N)]
    elif N % 5 == 0:
        # Here you must implement the factor 5 decimation
        # start following the template for the factor 3 implementation given above
        p0 = fft(x[0::5])
        p1 = fft(x[1::5])
        p2 = fft(x[2::5])
        p3 = fft(x[3::5])
        p4 = fft(x[4::5])

        return [p0[k % (N//5)] +
                p1[k % (N//5)] * numpy.exp(-2j*numpy.pi*k/N) +
                p2[k % (N//5)] * numpy.exp(-4j*numpy.pi*k/N) +
                p3[k % (N//5)] * numpy.exp(-6j*numpy.pi*k/N) +
                p4[k % (N//5)] * numpy.exp(-8j*numpy.pi*k/N)
               for k in range(N)]

    even = fft(x[0::2])
    odd = fft(x[1::2])
    combined = [0] * N
    for k in range(N//2):
        combined[k] = even[k] + omega(k,N) * odd[k]
        combined[k + N//2] = even[k] - omega(k,N) * odd[k]
    return combined


P1 = random.randint(1000,9999)
P2 = random.randint(1000,9999)

P1 = 5
#P2 = 3067
#P1 =  0 + int(sys.argv[1])
P2 = 11
P = P1*P2
tps = time.time_ns()
x = shor(P)
tps = (time.time_ns()-tps) / 1000000000.0
print ("computed: ", x[0], x[1], x[0]*x[1], tps)
print ("original: ", P1, P2, P, tps)


