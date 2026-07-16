import fitz
import sys

def extract_pdf_pages(pdf_path, pages):
    doc = fitz.open(pdf_path)
    for p_num in pages:
        if 0 <= p_num < len(doc):
            page = doc.load_page(p_num)
            pix = page.get_pixmap(dpi=150) # Good quality for web
            output_path = f"d:/dr.devesh/toc-page{p_num + 1}.jpg"
            pix.save(output_path)
            print(f"Saved {output_path}")
        else:
            print(f"Page {p_num} out of range.")
    doc.close()

if __name__ == "__main__":
    pdf_file = "d:/dr.devesh/table of conetent/The Art Of Residency.pdf"
    # Extract front cover (0-indexed 0)
    extract_pdf_pages(pdf_file, [0])
