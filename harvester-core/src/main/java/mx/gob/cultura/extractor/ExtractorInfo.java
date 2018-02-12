package mx.gob.cultura.extractor;

public class ExtractorInfo {
    private String status;
    private int processedItems;
    private int totalItems;
    private int transformedItems;
    private int indexedItems;

    public ExtractorInfo() {
        processedItems = 0;
        status = "";
        totalItems = 0;
        transformedItems = 0;
        indexedItems = 0;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getProcessedItems() {
        return processedItems;
    }

    public void setProcessedItems(int processedItems) {
        this.processedItems = processedItems;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public int getTransformedItems() {
        return transformedItems;
    }

    public void setTransformedItems(int transformedItems) {
        this.transformedItems = transformedItems;
    }

    public int getIndexedItems() {
        return indexedItems;
    }

    public void setIndexedItems(int indexedItems) {
        this.indexedItems = indexedItems;
    }
}
