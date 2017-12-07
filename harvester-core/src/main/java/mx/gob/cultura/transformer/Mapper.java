package mx.gob.cultura.transformer;

/**
 * Interface to encapsulate implementations of {@link Mapper} classes.
 * @param <S> Source data type
 * @param <T> Target data type
 */
public interface Mapper<S, T> {
    /**
     * Transforms source object type into target object type.
     * @param source source object type.
     * @return target object type instance.
     */
    T map(S source);
}
