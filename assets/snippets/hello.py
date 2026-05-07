def gcd(a: int, b: int) -> int:
    """Return the greatest common divisor of a and b."""
    while b:
        a, b = b, a % b
    return a


if __name__ == "__main__":
    print(gcd(12, 18))
